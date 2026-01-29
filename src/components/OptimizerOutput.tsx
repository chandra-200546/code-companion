import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Copy, 
  Code2, 
  Clock, 
  Database, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Target
} from "lucide-react";
import { OptimizationResult } from "@/hooks/useOptimization";
import { cn } from "@/lib/utils";

interface OptimizerOutputProps {
  result: OptimizationResult;
  language: string;
  originalCode: string;
}

export function OptimizerOutput({ result, language, originalCode }: OptimizerOutputProps) {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const handleCopyOriginal = async () => {
    await navigator.clipboard.writeText(originalCode);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handleCopyOptimized = async () => {
    await navigator.clipboard.writeText(result.optimizedCode);
    setCopiedOptimized(true);
    setTimeout(() => setCopiedOptimized(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Comparison Summary Card */}
      <Card className="bg-gradient-to-r from-success/10 via-card to-warning/10 border-border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Optimization Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Saved */}
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Time Complexity</span>
              </div>
              <p className="text-lg font-semibold text-success">{result.comparison.timeSaved}</p>
            </div>
            
            {/* Space Saved */}
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Space Complexity</span>
              </div>
              <p className="text-lg font-semibold text-success">{result.comparison.spaceSaved}</p>
            </div>
            
            {/* Overall */}
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Overall</span>
              </div>
              <p className="text-sm font-medium text-foreground">{result.comparison.overallImprovement}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Before vs After Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Code */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-destructive/10 border-b border-border">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-destructive" />
              <h3 className="font-semibold text-foreground">Original Code</h3>
              <span className="px-2 py-0.5 text-xs font-mono bg-destructive/20 text-destructive rounded">
                {result.originalAnalysis.timeComplexity}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyOriginal}
              className="text-muted-foreground hover:text-foreground"
            >
              {copiedOriginal ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <pre className="p-4 overflow-x-auto code-scrollbar max-h-80">
            <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
              {originalCode}
            </code>
          </pre>
          <div className="px-4 py-3 bg-secondary/30 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span><strong>Time:</strong> {result.originalAnalysis.timeComplexity}</span>
              <span><strong>Space:</strong> {result.originalAnalysis.spaceComplexity}</span>
            </div>
          </div>
        </Card>

        {/* Optimized Code */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-success/10 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-success" />
              <h3 className="font-semibold text-foreground">Optimized Code</h3>
              <span className="px-2 py-0.5 text-xs font-mono bg-success/20 text-success rounded">
                {result.optimizedAnalysis.timeComplexity}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyOptimized}
              className="text-muted-foreground hover:text-foreground"
            >
              {copiedOptimized ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <pre className="p-4 overflow-x-auto code-scrollbar max-h-80">
            <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
              {result.optimizedCode}
            </code>
          </pre>
          <div className="px-4 py-3 bg-secondary/30 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span><strong>Time:</strong> {result.optimizedAnalysis.timeComplexity}</span>
              <span><strong>Space:</strong> {result.optimizedAnalysis.spaceComplexity}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottlenecks & Inefficiencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bottlenecks */}
        <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border-b border-border">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="font-semibold text-foreground">Bottlenecks Identified</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {result.originalAnalysis.bottlenecks.map((bottleneck, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <span className="text-destructive mt-1">•</span>
                  {bottleneck}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Inefficiencies */}
        <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 px-4 py-3 bg-warning/10 border-b border-border">
            <Target className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-foreground">Inefficiencies Detected</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {result.originalAnalysis.inefficiencies.map((inefficiency, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <span className="text-warning mt-1">•</span>
                  {inefficiency}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Optimization Strategy */}
      <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 border-b border-border">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Optimization Strategy</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
            {result.optimizationStrategy.technique}
          </span>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Core Problem</h4>
            <p className="text-sm text-secondary-foreground">{result.coreLogic}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Why This Technique?</h4>
            <p className="text-sm text-secondary-foreground">{result.optimizationStrategy.reasoning}</p>
          </div>
        </div>
      </Card>

      {/* Improvements Made */}
      <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border-b border-border">
          <Check className="w-4 h-4 text-success" />
          <h3 className="font-semibold text-foreground">Improvements Applied</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {result.optimizedAnalysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-secondary-foreground">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Detailed Explanation */}
      <Card className="bg-card border-border overflow-hidden animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-2 px-4 py-3 bg-accent/10 border-b border-border">
          <ArrowRight className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Step-by-Step Explanation</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
            {result.explanation}
          </p>
        </div>
      </Card>
    </div>
  );
}
