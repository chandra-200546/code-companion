import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  frequency: string;
}

export interface Answer {
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  explanation: string;
}

export type CodeLanguage = "Python" | "Java" | "C++";

export function useInterviewPrep() {
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("Python");
  const { toast } = useToast();

  const fetchQuestions = async (company: string) => {
    setIsLoadingQuestions(true);
    setQuestions([]);
    setSelectedQuestion(null);
    setAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke("interview-questions", {
        body: { company },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const fetchAnswer = async (company: string, question: Question, language: CodeLanguage = codeLanguage) => {
    setIsLoadingAnswer(true);
    setSelectedQuestion(question);
    setAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke("interview-questions", {
        body: { company, questionIndex: question.id - 1, language },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setAnswer(data.answer || null);
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch answer",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  const clearSelection = () => {
    setSelectedQuestion(null);
    setAnswer(null);
  };

  return {
    isLoadingQuestions,
    isLoadingAnswer,
    questions,
    selectedQuestion,
    answer,
    codeLanguage,
    setCodeLanguage,
    fetchQuestions,
    fetchAnswer,
    clearSelection,
  };
}
