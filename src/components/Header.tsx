import { Code2, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="text-center space-y-4 mb-10">
      <div className="inline-flex items-center justify-center gap-3 mb-2">
        <div className="relative">
          <div className="absolute inset-0 blur-lg bg-primary/40 rounded-lg" />
          <div className="relative p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="text-gradient">Code Translator</span>
        <span className="text-foreground"> & </span>
        <span className="text-gradient">Explainer</span>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Transform code between languages with AI-powered translation, step-by-step explanations, 
        and complexity analysis. Built for learning and understanding.
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Powered by AI</span>
        <span className="text-border">•</span>
        <span>C++, Java, Python, JavaScript</span>
      </div>
    </header>
  );
}
