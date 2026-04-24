import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { bridge } from "@/lib/bridge";

/** Local Alt+key shortcuts (mirrors backend pynput allowlist). */
export function useShortcuts() {
  const { state, set } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state.penControlOn) {
          set({ penControlOn: false, infoMessage: "Pen control stopped (Esc)" });
          bridge.togglePenControl();
        }
        if (state.whiteboardVisible) set({ whiteboardVisible: false });
        return;
      }
      if (!e.altKey) return;
      const k = e.key.toLowerCase();
      switch (k) {
        case "w": e.preventDefault(); set({ whiteboardVisible: !state.whiteboardVisible }); bridge.toggleWhiteboard(); break;
        case "p": e.preventDefault(); set({ penControlOn: !state.penControlOn }); bridge.togglePenControl(); break;
        case "h": e.preventDefault(); set({ shortcutHelpVisible: true }); break;
        case "d": e.preventDefault(); { const v = !state.debugOn; set({ debugOn: v }); bridge.setDebugView(v); } break;
        case "s": e.preventDefault(); set({ previewClickMode: "sampleColor" }); break;
        case "r": e.preventDefault(); set({ calibrationStatus: "calibrating" }); bridge.startRecalibration(); break;
        case "l": e.preventDefault(); { const v = !state.strictLock; set({ strictLock: v }); bridge.setStrictLock(v); } break;
        case "u": e.preventDefault(); { const v = !state.ultraSmooth; set({ ultraSmooth: v }); bridge.setUltraSmooth(v); } break;
        case "1": e.preventDefault(); set({ perfProfile: "speed" }); bridge.setPerfProfile("speed"); break;
        case "2": e.preventDefault(); set({ perfProfile: "balanced" }); bridge.setPerfProfile("balanced"); break;
        case "3": e.preventDefault(); set({ perfProfile: "quality" }); bridge.setPerfProfile("quality"); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, set]);
}
