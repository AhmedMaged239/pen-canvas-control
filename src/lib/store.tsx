import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { CalibrationMode, CalibrationStatus, CameraInfo, MouseMode, PerfProfile } from "./bridge";
import { bridge } from "./bridge";

export interface AppState {
  // Camera
  cameraEnabled: boolean;
  cameraIndex: number;
  cameraList: CameraInfo[];
  cameraResolution: { width: number; height: number };
  cameraRotation: 0 | 90 | 180 | 270;
  cameraFlipX: boolean;
  cameraFlipY: boolean;

  // Calibration
  calibrationMode: CalibrationMode;
  calibrationStatus: CalibrationStatus;
  calibrationPrompt: string;

  // Tracking
  penControlOn: boolean;
  writeEnabled: boolean;
  writingActive: boolean;
  penTrackingPosition: { x: number; y: number } | null;

  // Tuning
  debugOn: boolean;
  perfProfile: PerfProfile;
  perfMix: number;
  strictLock: boolean;
  ultraSmooth: boolean;

  // Mouse
  leftHanded: boolean;
  mouseMode: MouseMode;
  mouseRange: { width: number; height: number };
  invertX: boolean;
  invertY: boolean;
  edgeScrollOn: boolean;
  edgeScrollSpeed: number;

  // UI
  theme: "dark" | "light";
  whiteboardVisible: boolean;
  themeTabVisible: boolean;
  shortcutHelpVisible: boolean;
  previewClickMode: "none" | "sampleColor" | "manualCorner";
  statusOverlayText: string;
  infoMessage: string;
}

const initial: AppState = {
  cameraEnabled: false,
  cameraIndex: 0,
  cameraList: [
    { index: 0, name: "Integrated Webcam" },
    { index: 1, name: "USB Camera" },
  ],
  cameraResolution: { width: 640, height: 480 },
  cameraRotation: 0,
  cameraFlipX: false,
  cameraFlipY: false,

  calibrationMode: "auto",
  calibrationStatus: "idle",
  calibrationPrompt: "",

  penControlOn: false,
  writeEnabled: true,
  writingActive: false,
  penTrackingPosition: null,

  debugOn: false,
  perfProfile: "balanced",
  perfMix: 50,
  strictLock: false,
  ultraSmooth: false,

  leftHanded: false,
  mouseMode: "fullscreen",
  mouseRange: { width: 640, height: 480 },
  invertX: false,
  invertY: false,
  edgeScrollOn: false,
  edgeScrollSpeed: 1,

  theme: "light",
  whiteboardVisible: false,
  themeTabVisible: false,
  shortcutHelpVisible: false,
  previewClickMode: "none",
  statusOverlayText: "Camera disabled — enable it from the sidebar",
  infoMessage: "Welcome to AirDesk",
};

type Action =
  | { type: "patch"; payload: Partial<AppState> }
  | { type: "reset" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "patch": return { ...state, ...action.payload };
    case "reset": return initial;
  }
}

interface Ctx {
  state: AppState;
  set: (p: Partial<AppState>) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const set = (p: Partial<AppState>) => dispatch({ type: "patch", payload: p });

  // (Theme handling moved to ThemeProvider — all themes are light.)

  // Auto status text based on camera state
  useEffect(() => {
    if (!state.cameraEnabled) {
      set({ statusOverlayText: "Camera disabled — enable it from the sidebar" });
    } else if (state.calibrationStatus === "calibrating") {
      set({ statusOverlayText: "Calibrating paper…" });
    } else if (state.calibrationStatus === "acceptReject") {
      set({ statusOverlayText: "Review calibration" });
    } else {
      set({ statusOverlayText: state.penControlOn ? "Tracking active" : "Camera ready" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cameraEnabled, state.calibrationStatus, state.penControlOn]);

  // Subscribe to backend events when running inside PyWebView
  useEffect(() => {
    if (!bridge.isLive()) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.airdesk = {
      onStatusText: (text: string) => set({ statusOverlayText: text }),
      onInfoText: (text: string) => set({ infoMessage: text }),
      onCalibrationState: (s: CalibrationStatus) => set({ calibrationStatus: s }),
      onCameraListUpdated: (list: CameraInfo[]) => set({ cameraList: list }),
      onPenControlState: (on: boolean) => set({ penControlOn: on }),
      onTrackingState: (pos: { x: number; y: number }) => set({ penTrackingPosition: pos }),
      onWhiteboardToggle: (v: boolean) => set({ whiteboardVisible: v }),
      onDebugState: (on: boolean) => set({ debugOn: on }),
    };
  }, []);

  const value = useMemo(() => ({ state, set }), [state]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}
