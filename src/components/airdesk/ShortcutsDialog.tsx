import { useApp } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SHORTCUTS: [string, string][] = [
  ["Alt + W", "Toggle whiteboard"],
  ["Alt + P", "Toggle pen control"],
  ["Alt + H", "Show this help"],
  ["Alt + D", "Debug view on/off"],
  ["Alt + S", "Sample pen color"],
  ["Alt + C", "Switch camera"],
  ["Alt + R", "Recalibrate"],
  ["Alt + 1 / 2 / 3", "Speed / Balanced / Quality"],
  ["Alt + L", "Toggle strict lock"],
  ["Alt + U", "Toggle ultra-smooth"],
  ["Alt + V", "Cycle camera resolution"],
  ["Alt + Q", "Quit app"],
  ["Esc", "Emergency stop pen control"],
  ["Ctrl (hold)", "Engage writing"],
];

export function ShortcutsDialog() {
  const { state, set } = useApp();
  return (
    <Dialog open={state.shortcutHelpVisible} onOpenChange={(o) => set({ shortcutHelpVisible: o })}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-1.5">
          {SHORTCUTS.map(([k, desc]) => (
            <div key={k} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/60">
              <span className="text-sm text-muted-foreground">{desc}</span>
              <kbd className="text-xs font-mono px-2 py-1 rounded-md bg-secondary border border-border">{k}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
