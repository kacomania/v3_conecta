import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { description, latitude, longitude, prefeitura_id } = await req.json();

    if (!description || !latitude || !longitude || !prefeitura_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    // Gerar embedding do texto
    const embedResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: description }] },
          outputDimensionality: 768
        }),
      }
    );

    if (!embedResponse.ok) {
      const errTxt = await embedResponse.text();
      console.error("Gemini Error:", errTxt);
      throw new Error(`Gemini Error: ${errTxt}`);
    }

    const embedData = await embedResponse.json();
    const embedding = embedData.embedding?.values;

    if (!embedding) {
      throw new Error("No embedding returned from Gemini");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Chamar RPC match_occurrences
    const { data: matches, error } = await supabaseAdmin.rpc("match_occurrences", {
      query_embedding: `[${embedding.join(",")}]`,
      query_lat: latitude,
      query_lng: longitude,
      query_prefeitura_id: prefeitura_id,
    });

    if (error) {
      console.error("RPC Error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
