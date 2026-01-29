import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supportedLangs = ["C++", "Java", "Python", "JavaScript"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, code } = await req.json();

    // Validate inputs
    if (!code || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Code cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!supportedLangs.includes(language)) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert algorithm optimizer and performance engineer. Your task is to analyze code and optimize its time and space complexity.

STEP 1 - CODE STRUCTURE ANALYSIS:
Scan the code structure thoroughly:
- Identify all loops (nested loops, while loops, for loops)
- Detect recursion patterns and their call stacks
- Analyze data structures used (arrays, maps, sets, etc.)
- Find redundant operations or unnecessary iterations

STEP 2 - CURRENT COMPLEXITY ESTIMATION:
Calculate the current time and space complexity:
- Time Complexity: Count operations relative to input size
- Space Complexity: Analyze memory allocation patterns
- Identify the bottleneck operations

STEP 3 - INEFFICIENCY DETECTION:
Detect inefficient patterns:
- Nested loops that could be flattened
- Redundant array/list traversals
- Unnecessary memory allocations
- Repeated calculations that could be cached
- Inefficient data structure choices

STEP 4 - CORE LOGIC IDENTIFICATION:
Identify the core problem being solved:
- What is the fundamental algorithmic problem?
- What are the constraints and requirements?
- What invariants must be maintained?

STEP 5 - ALGORITHM SELECTION:
Select better algorithms or patterns:
- Hash maps for O(1) lookups instead of O(n) searches
- Two-pointer technique for array problems
- Sliding window for contiguous subarray problems
- Dynamic programming for overlapping subproblems
- Binary search for sorted data
- Prefix sums for range queries
- Monotonic stack/queue for next greater/smaller elements

STEP 6 - CODE OPTIMIZATION:
Rewrite the code with optimized approach:
- Apply the selected algorithm
- Remove unnecessary memory usage
- Use in-place logic where possible
- Apply language-specific optimizations for ${language}

STEP 7 - VERIFICATION:
Calculate and verify new complexity:
- Confirm the new time complexity
- Confirm the new space complexity
- Ensure correctness is maintained

IMPORTANT: You must respond with a valid JSON object with exactly these fields:
{
  "originalAnalysis": {
    "timeComplexity": "string (e.g., 'O(n²)')",
    "spaceComplexity": "string (e.g., 'O(n)')",
    "bottlenecks": ["array of identified bottleneck descriptions"],
    "inefficiencies": ["array of inefficient patterns found"]
  },
  "coreLogic": "string (description of what the code is trying to solve)",
  "optimizationStrategy": {
    "technique": "string (e.g., 'Hash Map', 'Two Pointers', 'Dynamic Programming')",
    "reasoning": "string (why this technique was chosen)"
  },
  "optimizedCode": "string (the optimized code)",
  "optimizedAnalysis": {
    "timeComplexity": "string (new time complexity)",
    "spaceComplexity": "string (new space complexity)",
    "improvements": ["array of specific improvements made"]
  },
  "explanation": "string (detailed step-by-step explanation of the optimization)",
  "comparison": {
    "timeSaved": "string (e.g., 'Reduced from O(n²) to O(n)')",
    "spaceSaved": "string (e.g., 'Reduced from O(n) to O(1)')",
    "overallImprovement": "string (summary of the improvement)"
  }
}

Do not include markdown code blocks in your response. Return only valid JSON.`;

    const userPrompt = `Analyze and optimize this ${language} code for better time and space complexity:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Identify inefficiencies, apply the best algorithmic optimization, and provide the optimized version with a clear before/after comparison.`;

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

    return new Response(
      JSON.stringify({
        originalAnalysis: parsedResult.originalAnalysis,
        coreLogic: parsedResult.coreLogic,
        optimizationStrategy: parsedResult.optimizationStrategy,
        optimizedCode: parsedResult.optimizedCode,
        optimizedAnalysis: parsedResult.optimizedAnalysis,
        explanation: parsedResult.explanation,
        comparison: parsedResult.comparison,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Optimization error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
