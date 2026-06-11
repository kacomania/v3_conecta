import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Configuração CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { occurrence_id, feedback } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Se o usuário não enviou feedback (ou for muito curto/vazio)
    if (!feedback || feedback.trim().length === 0) {
      await supabaseAdmin
        .from("occurrences")
        .update({ sentiment: "NEUTRAL" })
        .eq("id", occurrence_id);
      return new Response(JSON.stringify({ sentiment: "NEUTRAL" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const prompt = `Classifique o sentimento deste texto de ouvidoria com APENAS UMA destas palavras: POSITIVE, NEUTRAL ou NEGATIVE. Texto: ${feedback}`;
    
    let sentiment = "NEUTRAL"; // Fallback default
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 10,
            }
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase() || "";
        
        if (["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(textResponse)) {
          sentiment = textResponse;
        } else if (textResponse.includes("POSITIVE")) {
          sentiment = "POSITIVE";
        } else if (textResponse.includes("NEGATIVE")) {
          sentiment = "NEGATIVE";
        }
      }
    } catch (e) {
      console.error("AI Error or Timeout:", e);
      // Fails silently, sentiment remains "NEUTRAL"
    }

    await supabaseAdmin
      .from("occurrences")
      .update({ sentiment })
      .eq("id", occurrence_id);

    return new Response(JSON.stringify({ sentiment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected Error:", error.message);
    // Mesmo em caso de erro extremo que passe do fallback inicial,
    // tentamos atualizar como NEUTRAL se tivermos o occurrence_id,
    // ou apenas retornamos erro HTTP padrão para falhas de parse.
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
