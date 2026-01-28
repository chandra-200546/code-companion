import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Code2, BookOpen, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputSectionProps {
  translatedCode: string;
  explanation: string;
  complexity: string;
  suggestions: string;
  targetLanguage: string;
}

export function OutputSection({
  translatedCode,
  explanation,
  complexity,
  suggestions,
  targetLanguage,
}: OutputSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Translated Code */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Translated Code</h3>
            <span className="px-2 py-0.5 text-xs font-mono bg-primary/20 text-primary rounded">
              {targetLanguage}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="p-4 overflow-x-auto code-scrollbar">
          <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
            {translatedCode}
          </code>
        </pre>
      </Card>

      {/* Explanation */}
      <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <BookOpen className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Step-by-Step Explanation</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </div>
      </Card>

      {/* Complexity */}
      <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <Clock className="w-4 h-4 text-warning" />
          <h3 className="font-semibold text-foreground">Time & Space Complexity</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap font-mono">
            {complexity}
          </p>
        </div>
      </Card>

      {/* Suggestions */}
      {suggestions && (
        <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <Lightbulb className="w-4 h-4 text-success" />
            <h3 className="font-semibold text-foreground">Suggestions & Improvements</h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
              {suggestions}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
