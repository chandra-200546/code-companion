import { ArrowLeft, Clock, Database, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Question, Answer } from "@/hooks/useInterviewPrep";

interface QuestionAnswerProps {
  company: string;
  question: Question;
  answer: Answer | null;
  isLoading: boolean;
  onBack: () => void;
}

const difficultyColors = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function QuestionAnswer({
  company,
  question,
  answer,
  isLoading,
  onBack,
}: QuestionAnswerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (answer?.code) {
      await navigator.clipboard.writeText(answer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {company}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", difficultyColors[question.difficulty])}
            >
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.category}
            </Badge>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            #{question.id}. {question.title}
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Generating detailed solution...</p>
        </div>
      ) : answer ? (
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Approach */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Approach</h3>
              <p className="text-muted-foreground leading-relaxed">{answer.approach}</p>
            </div>

            <Separator />

            {/* Complexity */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Time:</span>
                <span className="font-mono font-semibold text-foreground">
                  {answer.timeComplexity}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Space:</span>
                <span className="font-mono font-semibold text-foreground">
                  {answer.spaceComplexity}
                </span>
              </div>
            </div>

            <Separator />

            {/* Code Solution */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Solution Code</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <div className="relative rounded-lg bg-secondary/80 border border-border overflow-hidden">
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
                    {answer.code}
                  </code>
                </pre>
              </div>
            </div>

            <Separator />

            {/* Explanation */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Step-by-Step Explanation
              </h3>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {answer.explanation}
              </div>
            </div>
          </div>
        </ScrollArea>
      ) : null}
    </Card>
  );
}
