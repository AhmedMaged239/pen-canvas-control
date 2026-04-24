import { useState } from "react";
import { Palette, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/themes/useTheme";
import { ThemeCard } from "./ThemeCard";
import { useApp } from "@/lib/store";

export function ThemeTab() {
  const { currentTheme, themes, setTheme } = useTheme();
  const { set } = useApp();
  const [pendingId, setPendingId] = useState<string>(currentTheme.id);

  const apply = () => setTheme(pendingId);

  const previewInWhiteboard = () => {
    setTheme(pendingId);
    set({ whiteboardVisible: true, infoMessage: "Previewing theme in whiteboard 🎨" });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div
          className="h-9 w-9 rounded-xl grid place-items-center"
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <div
            className="text-base font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            🎨 Theme
          </div>
          <div
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Pick a vibe for your desk
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((t) => (
            <ThemeCard
              key={t.id}
              theme={t}
              selected={pendingId === t.id}
              onSelect={setPendingId}
            />
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="px-5 py-4 border-t flex flex-col sm:flex-row gap-2"
        style={{
          borderColor: "var(--border-color)",
          background: "var(--bg-overlay)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Button
          onClick={apply}
          disabled={pendingId === currentTheme.id}
          className="flex-1"
          style={{
            background: "var(--color-primary)",
            color: "var(--text-inverse)",
            boxShadow: "var(--shadow-glow-primary)",
          }}
        >
          <Check className="h-4 w-4 mr-2" />
          Apply Theme
        </Button>
        <Button
          variant="outline"
          onClick={previewInWhiteboard}
          className="flex-1"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview in Whiteboard
        </Button>
      </div>
    </div>
  );
}
