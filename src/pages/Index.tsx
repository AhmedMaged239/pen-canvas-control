import { AppStateProvider, useApp } from "@/lib/store";
import { Sidebar } from "@/components/airdesk/Sidebar";
import { PreviewPanel } from "@/components/airdesk/PreviewPanel";
import { Whiteboard } from "@/components/airdesk/Whiteboard";
import { ShortcutsDialog } from "@/components/airdesk/ShortcutsDialog";
import { useShortcuts } from "@/components/airdesk/useShortcuts";
import { ThemeTab } from "@/components/ThemeTab";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";

function ThemeOverlay() {
  const { state, set } = useApp();
  if (!state.themeTabVisible) return null;
  return (
    <div
      className="fixed inset-0 z-40 animate-fade-in"
      style={{ background: "var(--bg-overlay)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="absolute top-4 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => set({ themeTabVisible: false })}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="mx-auto my-6 h-[calc(100vh-3rem)] max-w-5xl rounded-3xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <ThemeTab />
      </div>
    </div>
  );
}

function Shell() {
  useShortcuts();
  useEffect(() => {
    document.title = "AirDesk — Webcam Pen Studio";
  }, []);
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar />
      <PreviewPanel />
      <Whiteboard />
      <ThemeOverlay />
      <ShortcutsDialog />
    </div>
  );
}

const Index = () => (
  <AppStateProvider>
    <Shell />
  </AppStateProvider>
);

export default Index;
