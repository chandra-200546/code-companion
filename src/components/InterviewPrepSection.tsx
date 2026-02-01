import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { CompanyList } from "./CompanyList";
import { QuestionsList } from "./QuestionsList";
import { QuestionAnswer } from "./QuestionAnswer";
import { useInterviewPrep } from "@/hooks/useInterviewPrep";

export function InterviewPrepSection() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const {
    isLoadingQuestions,
    isLoadingAnswer,
    questions,
    selectedQuestion,
    answer,
    codeLanguage,
    setCodeLanguage,
    fetchQuestions,
    fetchAnswer,
    clearSelection,
  } = useInterviewPrep();

  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
    fetchQuestions(company);
  };

  const handleSelectQuestion = (question: typeof selectedQuestion) => {
    if (selectedCompany && question) {
      fetchAnswer(selectedCompany, question, codeLanguage);
    }
  };

  const handleLanguageChange = (language: typeof codeLanguage) => {
    setCodeLanguage(language);
    if (selectedCompany && selectedQuestion) {
      fetchAnswer(selectedCompany, selectedQuestion, language);
    }
  };

  const handleBackToQuestions = () => {
    clearSelection();
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Interview Preparation
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Practice with top 100 DSA questions from leading tech companies. Click on a company
          to see their most frequently asked interview questions with detailed solutions.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Company List */}
        <CompanyList
          selectedCompany={selectedCompany}
          onSelectCompany={handleSelectCompany}
          isLoading={isLoadingQuestions}
        />

        {/* Questions or Answer View */}
        {selectedCompany && (
          <>
            {selectedQuestion ? (
              <QuestionAnswer
                company={selectedCompany}
                question={selectedQuestion}
                answer={answer}
                isLoading={isLoadingAnswer}
                codeLanguage={codeLanguage}
                onLanguageChange={handleLanguageChange}
                onBack={handleBackToQuestions}
              />
            ) : (
              <QuestionsList
                company={selectedCompany}
                questions={questions}
                selectedQuestion={selectedQuestion}
                onSelectQuestion={handleSelectQuestion}
                isLoading={isLoadingQuestions}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
