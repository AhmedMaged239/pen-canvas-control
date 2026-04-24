import { cn } from "@/lib/utils";

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  size?: "sm" | "md";
}

export function Segmented<T extends string>({ value, onChange, options, size = "md" }: SegmentedProps<T>) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full bg-secondary p-1 border border-border",
    )}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full font-medium transition-spring",
              size === "sm" ? "text-xs px-3 py-1" : "text-sm px-4 py-1.5",
              active
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
