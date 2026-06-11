const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set. Please set it before running the test.");
  process.exit(1);
}

async function testSentiment(feedback) {
  console.log(`\nTesting feedback: "${feedback}"`);
  const prompt = `Classifique o sentimento deste texto de ouvidoria com APENAS UMA destas palavras: POSITIVE, NEUTRAL ou NEGATIVE. Texto: ${feedback}`;
  let sentiment = "NEUTRAL";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 10 }
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase() || "";
      console.log(`Raw AI Response: "${textResponse}"`);
      
      if (["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(textResponse)) {
        sentiment = textResponse;
      } else if (textResponse.includes("POSITIVE")) {
        sentiment = "POSITIVE";
      } else if (textResponse.includes("NEGATIVE")) {
        sentiment = "NEGATIVE";
      }
    } else {
      console.error(`AI API Error: ${response.status} ${response.statusText}`);
      const errText = await response.text();
      console.error(errText);
    }
  } catch (e) {
    console.error("AI Error or Timeout:", e.message);
  }

  console.log(`Final Calculated Sentiment: ${sentiment}`);
  return sentiment;
}

async function runTests() {
  console.log("=== Edge Function / AI Prompt Tests ===");
  // Test 1: Negative
  await testSentiment("Equipe demorou muito, serviço péssimo!");
  
  // Test 2: Positive
  await testSentiment("O atendimento foi excelente, resolveram o problema no mesmo dia.");
  
  // Test 3: Neutral/Empty fallback
  await testSentiment("");
  
  console.log("\nTests completed.");
}

runTests();
