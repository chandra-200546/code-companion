import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: string }[];
  placeholder?: string;
  label: string;
  className?: string;
}

const languageIcons: Record<string, string> = {
  "C++": "⚡",
  Java: "☕",
  Python: "🐍",
  JavaScript: "💛",
};

export function LanguageSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  className,
}: LanguageSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-secondary border-border hover:bg-secondary/80 transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                <span>{languageIcons[option.value] || "📄"}</span>
                <span>{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
