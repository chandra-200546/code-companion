import { Card } from "@/components/ui/card";
import { Loader2, Zap, Search, Lightbulb, Code2 } from "lucide-react";

const steps = [
  { icon: Search, label: "Analyzing code structure..." },
  { icon: Zap, label: "Estimating complexity..." },
  { icon: Lightbulb, label: "Selecting optimization strategy..." },
  { icon: Code2, label: "Rewriting optimized code..." },
];

export function OptimizerLoading() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border p-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-warning animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-warning/10 animate-ping" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Optimizing Your Code</h3>
          <p className="text-sm text-muted-foreground">
            AI is analyzing patterns and applying optimizations...
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/30 animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <step.icon className="w-5 h-5 text-warning" />
              <span className="text-xs text-muted-foreground text-center">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
