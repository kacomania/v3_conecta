import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import admin from "npm:firebase-admin@11.11.0";

// Initialize Firebase Admin (assuming FIREBASE_SERVICE_ACCOUNT is stored in Supabase Edge Function Secrets)
const serviceAccountKey = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
if (serviceAccountKey && !admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (err) {
    console.error("Failed to initialize Firebase Admin", err);
  }
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const payload = await req.json();
    const record = payload.record;

    if (!record || !record.prefeitura_id) {
      return new Response("Invalid payload", { status: 400 });
    }

    const { prefeitura_id, title, body, severity } = record;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.rpc('get_fcm_tokens_by_prefeitura', { p_id: prefeitura_id });

    if (error) {
      console.error("Error fetching tokens:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ message: "No devices found" }), { status: 200 });
    }

    const tokens = data.map((d: any) => d.fcm_token).filter((t: string) => t);
    
    if (tokens.length === 0) {
       return new Response(JSON.stringify({ message: "No valid tokens found" }), { status: 200 });
    }

    // Multicast limit is 500
    const CHUNK_SIZE = 500;
    const sendPromises = [];

    // Chunking to handle large cities securely (Requirement #1)
    for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
      const chunk = tokens.slice(i, i + CHUNK_SIZE);
      const message = {
        notification: {
          title: title,
          body: body,
        },
        data: {
          severity: severity || "INFO",
          type: "ANNOUNCEMENT"
        },
        tokens: chunk,
      };

      if (admin.apps.length) {
         sendPromises.push(admin.messaging().sendEachForMulticast(message));
      } else {
         console.warn(`Firebase Admin not initialized. Simulated push for batch of ${chunk.length} devices.`);
      }
    }

    if (admin.apps.length) {
      const responses = await Promise.all(sendPromises);
      const totalSuccess = responses.reduce((acc, r) => acc + r.successCount, 0);
      const totalFailure = responses.reduce((acc, r) => acc + r.failureCount, 0);
      console.log(`Batches sent: ${responses.length}. Success: ${totalSuccess}, Failures: ${totalFailure}`);
    }

    return new Response(JSON.stringify({ message: "Broadcast processed", totalTokens: tokens.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
