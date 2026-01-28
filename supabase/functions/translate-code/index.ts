import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supportedSourceLangs = ["C++", "Java", "Python", "JavaScript"];
const supportedTargetLangs = ["Python", "JavaScript", "Java", "C++"];
const supportedPurposes = ["DSA", "Interview", "Readability"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceLang, targetLang, purpose, code } = await req.json();

    // Validate inputs
    if (!code || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Code cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!supportedSourceLangs.includes(sourceLang)) {
      return new Response(
        JSON.stringify({ error: `Unsupported source language: ${sourceLang}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!supportedTargetLangs.includes(targetLang)) {
      return new Response(
        JSON.stringify({ error: `Unsupported target language: ${targetLang}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!supportedPurposes.includes(purpose)) {
      return new Response(
        JSON.stringify({ error: `Unsupported purpose: ${purpose}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert software engineer, code reviewer, and programming tutor. Your task is to:

STEP 1 - CODE VALIDATION:
First, carefully analyze the provided ${sourceLang} code for any errors including:
- Syntax errors (missing semicolons, brackets, parentheses, etc.)
- Type errors (incorrect types, missing type declarations)
- Logic errors (infinite loops, off-by-one errors, null pointer issues)
- Missing imports or declarations
- Incorrect function signatures
- Variable scope issues
- Memory issues (in C++/Java)

STEP 2 - IF ERRORS FOUND:
- List each error with its location (line number if possible)
- Explain what the error is in simple terms
- Show the corrected version of that specific part
- Provide the fully corrected source code

STEP 3 - TRANSLATION:
After validation (and correction if needed), translate the (corrected) code from ${sourceLang} to ${targetLang}:
- Preserve the original logic and intent completely
- Follow best practices and idioms of ${targetLang}
- Optimize for ${purpose === "DSA" ? "Data Structures and Algorithms clarity" : purpose === "Interview" ? "clean, interview-ready code" : "maximum readability and maintainability"}

STEP 4 - EXPLANATION:
Provide a clear, step-by-step explanation of the code logic.

STEP 5 - COMPLEXITY ANALYSIS:
Analyze and provide time and space complexity.

IMPORTANT: You must respond with a valid JSON object with exactly these fields:
{
  "hasErrors": boolean (true if the original code had errors),
  "errors": [
    {
      "type": "string (e.g., 'Syntax Error', 'Logic Error', 'Type Error')",
      "location": "string (e.g., 'Line 5' or 'Function main()')",
      "description": "string (what the error is)",
      "original": "string (the problematic code snippet)",
      "corrected": "string (the fixed code snippet)"
    }
  ] (array of errors found, empty if no errors),
  "correctedSourceCode": "string (the corrected source code, or original if no errors)",
  "translatedCode": "string (the translated code in target language)",
  "explanation": "string (step-by-step explanation with numbered steps)",
  "complexity": "string (time and space complexity analysis)",
  "suggestions": "string (optional improvements or best practices)"
}

Do not include markdown code blocks in your response. Return only valid JSON.`;

    const userPrompt = `Validate and translate this ${sourceLang} code to ${targetLang}:

\`\`\`${sourceLang.toLowerCase()}
${code}
\`\`\`

Remember to first check for errors, then translate the corrected code, and return a JSON object with hasErrors, errors, correctedSourceCode, translatedCode, explanation, complexity, and suggestions fields.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get response from AI");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from AI
    let parsedResult;
    try {
      // Try to extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("translations").insert({
      source_language: sourceLang,
      target_language: targetLang,
      purpose: purpose,
      input_code: code,
      output_code: parsedResult.translatedCode,
      explanation: parsedResult.explanation,
      complexity: parsedResult.complexity,
      suggestions: parsedResult.suggestions,
    });

    return new Response(
      JSON.stringify({
        hasErrors: parsedResult.hasErrors || false,
        errors: parsedResult.errors || [],
        correctedSourceCode: parsedResult.correctedSourceCode || code,
        translatedCode: parsedResult.translatedCode,
        explanation: parsedResult.explanation,
        complexity: parsedResult.complexity,
        suggestions: parsedResult.suggestions,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
