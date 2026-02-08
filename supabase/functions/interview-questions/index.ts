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

IMPORTANT: Each company has DISTINCT interview patterns and question preferences. You must generate questions that are SPECIFIC to the company mentioned, not generic DSA questions.

Company-specific patterns to consider:
- Google: Heavy on graph algorithms, dynamic programming, system design thinking
- Amazon: Leadership principles applied to coding, scalability, arrays/strings
- Meta/Facebook: Graph problems, BFS/DFS, social network related problems
- Microsoft: Trees, linked lists, classic CS fundamentals
- Apple: Memory efficiency, optimization, clean code
- Netflix: Streaming/queue problems, caching, system design
- Uber/Lyft: Geospatial algorithms, graphs, real-time systems
- Airbnb: Search algorithms, matching problems, calendar/scheduling
- LinkedIn: Graph traversal, social connections, recommendation systems
- Twitter/X: Real-time processing, queues, rate limiting
- Stripe: Payment processing, precision, edge cases
- Bloomberg: Financial algorithms, data processing, time series
- Oracle: Database-related problems, SQL concepts, enterprise patterns
- Salesforce: CRM patterns, data relationships, multi-tenancy
- Adobe: Image processing concepts, creative algorithms
- Spotify: Music recommendation, playlists, audio algorithms
- Dropbox: File systems, synchronization, storage optimization
- Snap: Image/video processing, real-time, stories/feeds
- Pinterest: Image search, recommendation, visual algorithms
- Reddit: Voting algorithms, ranking, community detection

Generate exactly 100 DSA interview questions that reflect the SPECIFIC company's known interview style and problem preferences.

Your response must be a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "title": "Problem Title Here",
      "difficulty": "Easy",
      "category": "Arrays",
      "frequency": "Very High"
    }
  ]
}

Categories: Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Binary Search, Stack, Queue, Heap, Hashmap, Two Pointers, Sliding Window, Recursion, Backtracking, Greedy, Math, Bit Manipulation, Design, Sorting.

Difficulties: Easy, Medium, Hard.

Frequency: Very High, High, Medium, Low.`;

      userPrompt = `Generate the top 100 DSA interview questions that are SPECIFICALLY asked at ${company}. 

The questions MUST reflect ${company}'s unique interview style, problem preferences, and the types of challenges they're known to focus on. Do NOT generate generic questions - make them tailored to what ${company} specifically looks for in candidates.

For example, if this is Google, focus more on graph/DP problems. If Amazon, focus on scalability and arrays. Each company should have a noticeably different set of questions.`;
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

    // Parse the JSON response with robust extraction
    let jsonStr = content;
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
    
    // Extract the JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", content.substring(0, 500));
      throw new Error("Invalid response format - no JSON object found");
    }
    
    jsonStr = jsonMatch[0];
    
    // Sanitize control characters within string values only
    // This regex finds string values and escapes control chars within them
    jsonStr = jsonStr.replace(/"([^"\\]|\\.)*"/g, (match) => {
      return match.replace(/[\x00-\x1F\x7F]/g, (char: string) => {
        const escapes: Record<string, string> = {
          '\n': '\\n',
          '\r': '\\r',
          '\t': '\\t',
          '\b': '\\b',
          '\f': '\\f',
        };
        return escapes[char] || '';
      });
    });

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Attempted to parse:", jsonStr.substring(0, 1000));
      throw new Error("Failed to parse AI response as JSON");
    }

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
