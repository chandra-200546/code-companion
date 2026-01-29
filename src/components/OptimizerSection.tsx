import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { LanguageSelect } from "@/components/LanguageSelect";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { useOptimization } from "@/hooks/useOptimization";
import { OptimizerOutput } from "@/components/OptimizerOutput";
import { OptimizerLoading } from "@/components/OptimizerLoading";

const languages = [
  { value: "C++", label: "C++" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
];

export function OptimizerSection() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("C++");
  const { isLoading, result, optimize } = useOptimization();

  const handleOptimize = () => {
    optimize(language, code);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-warning">Complexity Optimizer</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Auto Time & Space Complexity Reducer
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Paste your code and let AI analyze, optimize, and rewrite it using better algorithms. 
          Get a detailed before vs. after comparison with explanations.
        </p>
      </div>

      {/* Input Section */}
      <Card className="bg-card/50 backdrop-blur-sm border-border p-6">
        <div className="space-y-6">
          <div className="max-w-xs">
            <LanguageSelect
              label="Code Language"
              value={language}
              onChange={setLanguage}
              options={languages}
              placeholder="Select language..."
            />
          </div>

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            placeholder={`Paste your ${language} code here to optimize...`}
          />

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleOptimize}
              disabled={isLoading || !code.trim()}
              size="lg"
              className="bg-gradient-to-r from-warning to-orange-500 hover:from-warning/90 hover:to-orange-500/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-lg shadow-warning/25 transition-all duration-300 hover:shadow-warning/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Optimize Complexity
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Output Section */}
      {isLoading && <OptimizerLoading />}
      
      {result && !isLoading && (
        <OptimizerOutput result={result} language={language} originalCode={code} />
      )}
    </div>
  );
}
