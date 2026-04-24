import { AppStateProvider } from "@/lib/store";
import { Sidebar } from "@/components/airdesk/Sidebar";
import { PreviewPanel } from "@/components/airdesk/PreviewPanel";
import { Whiteboard } from "@/components/airdesk/Whiteboard";
import { ShortcutsDialog } from "@/components/airdesk/ShortcutsDialog";
import { useShortcuts } from "@/components/airdesk/useShortcuts";
import { useEffect } from "react";

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
