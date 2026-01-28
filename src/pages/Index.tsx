import { useState } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { LanguageSelect } from "@/components/LanguageSelect";
import { PurposeSelect } from "@/components/PurposeSelect";
import { TranslateButton } from "@/components/TranslateButton";
import { OutputSection } from "@/components/OutputSection";
import { LoadingState } from "@/components/LoadingState";
import { ErrorValidation } from "@/components/ErrorValidation";
import { useTranslation } from "@/hooks/useTranslation";
import { Card } from "@/components/ui/card";

const sourceLangs = [
  { value: "C++", label: "C++" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
];

const targetLangs = [
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "Java", label: "Java" },
  { value: "C++", label: "C++" },
];

const Index = () => {
  const [code, setCode] = useState("");
  const [sourceLang, setSourceLang] = useState("C++");
  const [targetLang, setTargetLang] = useState("Python");
  const [purpose, setPurpose] = useState("DSA");
  
  const { isLoading, result, translate } = useTranslation();

  const handleTranslate = () => {
    translate(sourceLang, targetLang, purpose, code);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Header />

        <div className="space-y-8">
          {/* Input Section */}
          <Card className="bg-card/50 backdrop-blur-sm border-border p-6">
            <div className="space-y-6">
              {/* Language and Purpose Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LanguageSelect
                  label="Source Language"
                  value={sourceLang}
                  onChange={setSourceLang}
                  options={sourceLangs}
                  placeholder="Select source..."
                />
                <LanguageSelect
                  label="Target Language"
                  value={targetLang}
                  onChange={setTargetLang}
                  options={targetLangs}
                  placeholder="Select target..."
                />
                <PurposeSelect
                  value={purpose}
                  onChange={setPurpose}
                />
              </div>

              {/* Code Input */}
              <CodeEditor
                value={code}
                onChange={setCode}
                language={sourceLang}
                placeholder={`Paste your ${sourceLang} code here...`}
              />

              {/* Translate Button */}
              <div className="flex justify-center pt-2">
                <TranslateButton
                  onClick={handleTranslate}
                  isLoading={isLoading}
                  disabled={!code.trim()}
                />
              </div>
            </div>
          </Card>

          {/* Output Section */}
          {isLoading && <LoadingState />}
          
          {result && !isLoading && (
            <>
              <ErrorValidation
                hasErrors={result.hasErrors}
                errors={result.errors}
                correctedSourceCode={result.correctedSourceCode}
                sourceLanguage={sourceLang}
              />
              <OutputSection
                translatedCode={result.translatedCode}
                explanation={result.explanation}
                complexity={result.complexity}
                suggestions={result.suggestions}
                targetLanguage={targetLang}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Built for learning and understanding • AI-powered code translation</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
