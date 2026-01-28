import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranslateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
}

export function TranslateButton({
  onClick,
  isLoading,
  disabled,
  className,
}: TranslateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative overflow-hidden px-8 py-6 text-lg font-semibold",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 glow-primary hover:glow-primary-strong",
        "transition-all duration-300 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Translating...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Convert & Explain
          <ArrowRight className="w-5 h-5 ml-2" />
        </>
      )}
    </Button>
  );
}
