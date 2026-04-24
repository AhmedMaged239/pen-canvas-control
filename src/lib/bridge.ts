/**
 * AirDesk backend bridge.
 *
 * In production this calls into PyWebView's `window.pywebview.api.<method>()`.
 * In the browser preview we fall back to a small mock so the UI is fully
 * interactive for design review.
 */

export type CalibrationStatus = "idle" | "calibrating" | "acceptReject" | "stopped";
export type PerfProfile = "speed" | "balanced" | "quality";
export type MouseMode = "fullscreen" | "fixed" | "touchpad";
export type CalibrationMode = "auto" | "manual";

export interface CameraInfo { index: number; name: string }

declare global {
  interface Window {
    pywebview?: { api: Record<string, (...args: unknown[]) => Promise<unknown>> };
  }
}

const hasPyWebView = () =>
  typeof window !== "undefined" && !!window.pywebview?.api;

async function call<T = unknown>(name: string, ...args: unknown[]): Promise<T | null> {
  if (hasPyWebView()) {
    try {
      return (await window.pywebview!.api[name](...args)) as T;
    } catch (e) {
      console.warn(`[bridge] ${name} failed`, e);
      return null;
    }
  }
  // Browser preview: no-op mock
  return null;
}

export const bridge = {
  // Camera
  getCameraList: () => call<CameraInfo[]>("get_camera_list"),
  selectCamera: (i: number) => call("select_camera", i),
  refreshCameraList: () => call<CameraInfo[]>("refresh_camera_list"),
  enableCamera: (on: boolean) => call("enable_camera", on),
  setCameraResolution: (w: number, h: number) => call("set_camera_resolution", w, h),
  setCameraRotation: (deg: number) => call("set_camera_rotation", deg),
  setCameraFlip: (x: boolean, y: boolean) => call("set_camera_flip", x, y),
  setPreviewClickMode: (m: string) => call("set_preview_click_mode", m),

  // Calibration
  setCalibrationMode: (m: CalibrationMode) => call("set_calibration_mode", m),
  startRecalibration: () => call("start_recalibration"),
  stopCalibration: () => call("stop_calibration"),
  acceptCalibration: () => call("accept_calibration"),
  rejectCalibration: () => call("reject_calibration"),
  addCalibrationCorner: (x: number, y: number) => call("add_calibration_corner", x, y),
  samplePenColorFromPoint: (x: number, y: number) => call("sample_pen_color_from_point", x, y),
  samplePenColorCenter: () => call("sample_pen_color_center"),

  // Tracking / mouse
  togglePenControl: () => call("toggle_pen_control"),
  setWriteEnabled: (on: boolean) => call("set_write_enabled", on),
  setLeftHanded: (on: boolean) => call("set_left_handed", on),
  setMouseMode: (m: MouseMode) => call("set_mouse_mode", m),
  setMouseArea: (w: number, h: number) => call("set_mouse_area", w, h),
  setInvertX: (on: boolean) => call("set_invert_x", on),
  setInvertY: (on: boolean) => call("set_invert_y", on),
  setEdgeScroll: (on: boolean) => call("set_edge_scroll", on),
  setEdgeScrollSpeed: (v: number) => call("set_edge_scroll_speed", v),

  // Tuning
  setDebugView: (on: boolean) => call("set_debug_view", on),
  setPerfProfile: (p: PerfProfile) => call("set_perf_profile", p),
  setPerfMix: (v: number) => call("set_perf_mix", v),
  setStrictLock: (on: boolean) => call("set_strict_lock", on),
  setUltraSmooth: (on: boolean) => call("set_ultra_smooth", on),

  // Whiteboard
  toggleWhiteboard: () => call("toggle_whiteboard"),
  setWhiteboardVisible: (on: boolean) => call("set_whiteboard_visible", on),

  // Misc
  showShortcutsHelp: () => call("show_shortcuts_help"),
  showMessage: (text: string) => call("show_message", text),
  setTheme: (t: "dark" | "light") => call("set_theme", t),

  isLive: hasPyWebView,
};
