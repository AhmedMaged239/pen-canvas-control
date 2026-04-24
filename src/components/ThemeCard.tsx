import { cn } from "@/lib/utils";
import type { Theme } from "@/themes";

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  const c = theme.colors;
  return (
    <button
      type="button"
      onClick={() => onSelect(theme.id)}
      className={cn(
        "group text-left rounded-2xl p-4 flex flex-col gap-3 transition-all",
        "hover:-translate-y-0.5",
      )}
      style={{
        background: c["--bg-surface"],
        border: selected
          ? `2px solid ${c["--color-primary"]}`
          : `1px solid ${c["--border-color"]}`,
        boxShadow: selected
          ? `${c["--shadow-lg"]}, ${c["--shadow-glow-primary"]}`
          : c["--shadow-sm"],
        transform: selected ? "scale(1.02)" : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-xl grid place-items-center text-xl shrink-0"
          style={{
            background: c["--color-primary-light"],
            color: c["--color-primary"],
          }}
        >
          {theme.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="font-semibold text-sm leading-tight truncate"
            style={{ color: c["--text-primary"] }}
          >
            {theme.name}
          </div>
          <div
            className="text-xs mt-0.5 line-clamp-2"
            style={{ color: c["--text-secondary"] }}
          >
            {theme.tagline}
          </div>
        </div>
      </div>

      {/* Swatch strip: bgPrimary | primary | accent */}
      <div
        className="flex h-6 rounded-lg overflow-hidden"
        style={{ border: `1px solid ${c["--border-color"]}` }}
      >
        <div className="flex-1" style={{ background: c["--bg-primary"] }} />
        <div className="flex-1" style={{ background: c["--color-primary"] }} />
        <div className="flex-1" style={{ background: c["--color-accent"] }} />
      </div>

      {selected && (
        <div
          className="text-[10px] uppercase tracking-widest font-bold text-center"
          style={{ color: c["--color-primary"] }}
        >
          ✓ Selected
        </div>
      )}
    </button>
  );
}
