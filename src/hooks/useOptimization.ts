import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OriginalAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  bottlenecks: string[];
  inefficiencies: string[];
}

interface OptimizationStrategy {
  technique: string;
  reasoning: string;
}

interface OptimizedAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  improvements: string[];
}

interface Comparison {
  timeSaved: string;
  spaceSaved: string;
  overallImprovement: string;
}

export interface OptimizationResult {
  originalAnalysis: OriginalAnalysis;
  coreLogic: string;
  optimizationStrategy: OptimizationStrategy;
  optimizedCode: string;
  optimizedAnalysis: OptimizedAnalysis;
  explanation: string;
  comparison: Comparison;
}

export function useOptimization() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const optimize = async (language: string, code: string) => {
    if (!code.trim()) {
      toast.error("Please enter some code to optimize");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("optimize-complexity", {
        body: { language, code },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        originalAnalysis: data.originalAnalysis,
        coreLogic: data.coreLogic,
        optimizationStrategy: data.optimizationStrategy,
        optimizedCode: data.optimizedCode,
        optimizedAnalysis: data.optimizedAnalysis,
        explanation: data.explanation,
        comparison: data.comparison,
      });

      toast.success("Code optimized successfully!");
    } catch (error) {
      console.error("Optimization error:", error);
      const message = error instanceof Error ? error.message : "Failed to optimize code";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    isLoading,
    result,
    optimize,
    reset,
  };
}
