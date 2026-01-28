import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PurposeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const purposes = [
  { value: "DSA", label: "DSA / Algorithms", description: "Optimized for competitive programming" },
  { value: "Interview", label: "Interview Ready", description: "Clean, interview-focused code" },
  { value: "Readability", label: "Readability", description: "Maximum clarity and maintainability" },
];

export function PurposeSelect({ value, onChange, className }: PurposeSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-muted-foreground">Purpose</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-secondary border-border hover:bg-secondary/80 transition-colors">
          <SelectValue placeholder="Select purpose..." />
        </SelectTrigger>
        <SelectContent>
          {purposes.map((purpose) => (
            <SelectItem key={purpose.value} value={purpose.value}>
              <span className="flex flex-col items-start">
                <span className="font-medium">{purpose.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
