import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import admin from "npm:firebase-admin";

// Cache do app do Firebase para evitar reinicialização na Edge Function
let isFirebaseInitialized = false;

serve(async (req) => {
  try {
    const payload = await req.json();

    // Supabase variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create a Supabase client with the service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Firebase Admin se tiver a Service Account
    const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    
    if (serviceAccountStr && !isFirebaseInitialized) {
      try {
        const serviceAccount = JSON.parse(serviceAccountStr);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        isFirebaseInitialized = true;
      } catch (err) {
        console.error("Failed to initialize Firebase Admin:", err);
      }
    }

    // Assuming the payload comes from a Database Webhook on the `notifications` table
    const notification = payload.record;
    if (!notification || !notification.user_id) {
      return new Response(JSON.stringify({ error: "No user_id in payload" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the FCM token for the user
    const { data: devices, error } = await supabase
      .from('user_devices')
      .select('fcm_token')
      .eq('user_id', notification.user_id);

    if (error) {
      console.error('Error fetching devices:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!devices || devices.length === 0) {
      return new Response(JSON.stringify({ message: "No devices found for user" }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sendResults = [];

    for (const device of devices) {
      const fcmToken = device.fcm_token;
      
      const protocolNumber = notification.occurrence_id 
        ? notification.occurrence_id.split('-')[0].toUpperCase()
        : 'DESCONHECIDO';

      const fcmMessage = {
        token: fcmToken,
        notification: {
          title: `Protocolo #${protocolNumber}`,
          body: notification.message || "Você tem uma nova mensagem."
        },
        data: {
          notification_id: notification.id || "",
          occurrence_id: notification.occurrence_id || ""
        }
      };

      if (isFirebaseInitialized) {
        try {
          const response = await admin.messaging().send(fcmMessage);
          sendResults.push({ success: true, response });
        } catch (sendError) {
          console.error("FCM Send Error:", sendError);
          sendResults.push({ success: false, error: sendError.message, token: fcmToken });
        }
      } else {
         console.warn("FCM credentials missing. Mocking success for token:", fcmToken);
         sendResults.push({ name: `projects/mock/messages/mock-id-${fcmToken}` });
      }
    }

    return new Response(JSON.stringify({ success: true, results: sendResults }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
