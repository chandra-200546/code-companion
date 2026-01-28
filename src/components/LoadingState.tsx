import { Code2, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full animate-pulse" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <Code2 className="w-5 h-5 animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="text-lg font-medium">Analyzing code...</span>
        <Sparkles className="w-5 h-5 animate-bounce" style={{ animationDelay: "0.2s" }} />
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full bg-primary",
              "animate-bounce"
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground max-w-md text-center">
        Translating your code and generating a detailed explanation with complexity analysis...
      </p>
    </div>
  );
}
