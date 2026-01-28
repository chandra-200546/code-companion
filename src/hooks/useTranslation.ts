import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranslationResult {
  translatedCode: string;
  explanation: string;
  complexity: string;
  suggestions: string;
}

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);

  const translate = async (
    sourceLang: string,
    targetLang: string,
    purpose: string,
    code: string
  ) => {
    if (!code.trim()) {
      toast.error("Please enter some code to translate");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("translate-code", {
        body: {
          sourceLang,
          targetLang,
          purpose,
          code,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        translatedCode: data.translatedCode,
        explanation: data.explanation,
        complexity: data.complexity,
        suggestions: data.suggestions || "",
      });

      toast.success("Code translated successfully!");
    } catch (error) {
      console.error("Translation error:", error);
      const message = error instanceof Error ? error.message : "Failed to translate code";
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
    translate,
    reset,
  };
}
