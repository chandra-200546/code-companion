import { ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Question } from "@/hooks/useInterviewPrep";

interface QuestionsListProps {
  company: string;
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question) => void;
  isLoading: boolean;
}

const difficultyColors = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

const frequencyColors = {
  "Very High": "bg-purple-500/20 text-purple-400",
  High: "bg-blue-500/20 text-blue-400",
  Medium: "bg-cyan-500/20 text-cyan-400",
  Low: "bg-muted text-muted-foreground",
};

export function QuestionsList({
  company,
  questions,
  selectedQuestion,
  onSelectQuestion,
  isLoading,
}: QuestionsListProps) {
  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading questions for {company}...</p>
        </div>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          Top 100 DSA Questions at <span className="text-primary">{company}</span>
        </h3>
        <Badge variant="secondary">{questions.length} Questions</Badge>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {questions.map((question) => (
            <button
              key={question.id}
              onClick={() => onSelectQuestion(question)}
              className={cn(
                "w-full p-4 rounded-lg text-left transition-all duration-200",
                "hover:bg-secondary/80 group",
                selectedQuestion?.id === question.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary/50 border border-transparent"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">#{question.id}</span>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", difficultyColors[question.difficulty])}
                    >
                      {question.difficulty}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", frequencyColors[question.frequency as keyof typeof frequencyColors] || frequencyColors.Medium)}
                    >
                      {question.frequency}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground truncate">{question.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{question.category}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
