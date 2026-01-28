import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  language?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "Paste your code here...",
  readOnly = false,
  language = "code",
  className,
}: CodeEditorProps) {
  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 text-xs font-mono bg-secondary/80 text-muted-foreground rounded">
          {language}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          "w-full min-h-[300px] p-4 pt-10 font-mono text-sm leading-relaxed",
          "bg-code-bg border border-code-border rounded-lg",
          "text-foreground placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
          "resize-y code-scrollbar transition-all duration-200",
          readOnly && "cursor-default bg-code-bg/50"
        )}
      />
    </div>
  );
}
