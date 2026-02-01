import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company, questionIndex, language = "Python" } = await req.json();

    if (!company) {
      throw new Error("Company name is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt: string;
    let userPrompt: string;

    if (questionIndex !== undefined) {
      // Fetch answer for a specific question
      systemPrompt = `You are a DSA interview expert. Provide a detailed, well-explained solution for the given DSA interview question.

Your response must be a JSON object with this structure:
{
  "answer": {
    "approach": "Brief explanation of the approach",
    "timeComplexity": "O(n) or similar",
    "spaceComplexity": "O(1) or similar",
    "code": "Complete working code solution in ${language}",
    "explanation": "Step-by-step explanation of the solution"
  }
}

Make the explanation clear and interview-ready. Include edge cases if relevant. The code MUST be in ${language}.`;

      userPrompt = `Provide a detailed solution for this DSA question commonly asked at ${company}:
Question #${questionIndex + 1}

Generate a typical DSA question for position ${questionIndex + 1} that ${company} would ask, then provide its complete solution in ${language}.`;
    } else {
      // Fetch list of questions
      systemPrompt = `You are a DSA interview preparation expert with deep knowledge of technical interviews at top tech companies.

Generate exactly 100 DSA interview questions that are commonly asked at the specified company. These should be realistic questions based on the company's known interview patterns.

Your response must be a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "title": "Two Sum",
      "difficulty": "Easy",
      "category": "Arrays",
      "frequency": "Very High"
    }
  ]
}

Categories should include: Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Binary Search, Stack, Queue, Heap, Hashmap, Two Pointers, Sliding Window, Recursion, Backtracking, Greedy, Math, Bit Manipulation, Design, Sorting.

Difficulties should be: Easy, Medium, Hard.

Frequency should be: Very High, High, Medium, Low.

Make the questions realistic and company-specific based on known interview patterns.`;

      userPrompt = `Generate the top 100 DSA interview questions commonly asked at ${company}. Include a mix of difficulties and categories that match ${company}'s interview style.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Interview questions error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate questions";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
