import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeError {
  type: string;
  location: string;
  description: string;
  original: string;
  corrected: string;
}

interface ErrorValidationProps {
  hasErrors: boolean;
  errors: CodeError[];
  correctedSourceCode: string;
  sourceLanguage: string;
}

export function ErrorValidation({
  hasErrors,
  errors,
  correctedSourceCode,
  sourceLanguage,
}: ErrorValidationProps) {
  if (!hasErrors || errors.length === 0) {
    return (
      <Card className="bg-card border-success/30 overflow-hidden animate-fade-in mb-6">
        <div className="flex items-center gap-3 px-4 py-3 bg-success/10 border-b border-success/20">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <h3 className="font-semibold text-success">No Errors Detected</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Your {sourceLanguage} code passed validation with no syntax, type, or logic errors detected.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in mb-6">
      {/* Error Summary Header */}
      <Card className="bg-card border-warning/30 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-warning/10 border-b border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-warning">
            {errors.length} Error{errors.length > 1 ? "s" : ""} Found & Corrected
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            We detected issues in your {sourceLanguage} code and automatically corrected them before translation.
            Review the corrections below to learn from these mistakes.
          </p>
        </div>
      </Card>

      {/* Individual Errors */}
      {errors.map((error, index) => (
        <Card
          key={index}
          className="bg-card border-border overflow-hidden animate-slide-in-right"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                {index + 1}
              </span>
              <span className="font-semibold text-foreground">{error.type}</span>
              <span className="text-sm text-muted-foreground">• {error.location}</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Error Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">What went wrong:</h4>
              <p className="text-sm text-foreground">{error.description}</p>
            </div>

            {/* Before/After Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original (Wrong) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono bg-destructive/20 text-destructive rounded">
                    ✗ Original
                  </span>
                </div>
                <pre className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 overflow-x-auto code-scrollbar">
                  <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
                    {error.original}
                  </code>
                </pre>
              </div>

              {/* Corrected */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono bg-success/20 text-success rounded">
                    ✓ Corrected
                  </span>
                </div>
                <pre className="p-3 rounded-lg bg-success/5 border border-success/20 overflow-x-auto code-scrollbar">
                  <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
                    {error.corrected}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Corrected Full Code */}
      <Card className="bg-card border-success/30 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border-b border-success/20">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <h3 className="font-semibold text-foreground">Corrected {sourceLanguage} Code</h3>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Used for translation</span>
        </div>
        <pre className="p-4 overflow-x-auto code-scrollbar max-h-64">
          <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
            {correctedSourceCode}
          </code>
        </pre>
      </Card>
    </div>
  );
}
