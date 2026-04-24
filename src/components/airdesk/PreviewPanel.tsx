import { useApp } from "@/lib/store";
import { bridge } from "@/lib/bridge";
import { cn } from "@/lib/utils";
import { Camera, CircleDot, Pipette, Crosshair } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PreviewPanel() {
  const { state, set } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  // Animated demo cursor when camera enabled & no real tracking position
  useEffect(() => {
    if (!state.cameraEnabled || state.penTrackingPosition) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const dt = (t - start) / 1000;
      setCursor({
        x: 0.5 + Math.sin(dt * 0.7) * 0.28,
        y: 0.5 + Math.cos(dt * 0.5) * 0.22,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state.cameraEnabled, state.penTrackingPosition]);

  const realCursor = state.penTrackingPosition ?? cursor;

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (state.previewClickMode === "sampleColor") {
      bridge.samplePenColorFromPoint(x, y);
      set({ previewClickMode: "none", infoMessage: "Pen color sampled ✓" });
    } else if (state.previewClickMode === "manualCorner") {
      bridge.addCalibrationCorner(x, y);
      set({ infoMessage: "Corner added" });
    }
  };

  const isCalibrating =
    state.calibrationStatus === "calibrating" || state.calibrationStatus === "acceptReject";

  const statusTone =
    state.calibrationStatus === "acceptReject" ? "bg-warning text-warning-foreground"
    : state.penControlOn ? "bg-success text-success-foreground"
    : isCalibrating ? "bg-accent text-accent-foreground"
    : state.cameraEnabled ? "bg-primary/15 text-primary border border-primary/30"
    : "bg-secondary text-muted-foreground border border-border";

  return (
    <main className="flex-1 min-w-0 p-6 flex flex-col gap-4">
      {/* Top toolbar inside preview area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-spring", statusTone)}>
            <CircleDot className={cn("h-3 w-3", state.penControlOn && "pulse-dot")} />
            {state.statusOverlayText}
          </span>
          {state.previewClickMode !== "none" && (
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/30 animate-fade-in">
              <Pipette className="h-3 w-3" />
              {state.previewClickMode === "sampleColor" ? "Click pen tip in preview" : "Click paper corner"}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {state.cameraResolution.width}×{state.cameraResolution.height} · {state.cameraRotation}°
          {state.cameraFlipX && " · flip-x"}
          {state.cameraFlipY && " · flip-y"}
        </div>
      </div>

      {/* Preview surface */}
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative flex-1 rounded-3xl preview-surface border border-border/60 overflow-hidden transition-spring select-none",
          state.cameraEnabled && "preview-glow-active",
          state.previewClickMode !== "none" && "cursor-crosshair"
        )}
      >
        {!state.cameraEnabled ? (
          <div className="absolute inset-0 grid place-items-center text-center px-8">
            <div className="space-y-4 max-w-md">
              <div className="mx-auto h-16 w-16 rounded-2xl glass grid place-items-center">
                <Camera className="h-7 w-7 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Your webcam preview will appear here</h2>
              <p className="text-sm text-muted-foreground">
                Pick a camera in the sidebar and toggle <span className="text-primary font-medium">Enable camera input</span> to start tracking your pen.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* faux camera shimmer */}
            <div className="absolute inset-0 opacity-70" style={{
              background: "radial-gradient(circle at 30% 20%, hsl(var(--primary)/0.18), transparent 50%), radial-gradient(circle at 70% 80%, hsl(var(--accent)/0.15), transparent 50%)",
            }} />
            {/* paper outline (mock) */}
            <div className="absolute left-[12%] right-[12%] top-[14%] bottom-[14%] rounded-xl border-2 border-dashed border-primary/40" />

            {/* Calibration grid */}
            {isCalibrating && (
              <>
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {[
                  { l: "12%", t: "14%" }, { l: "88%", t: "14%" },
                  { l: "12%", t: "86%" }, { l: "88%", t: "86%" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-accent shadow-glow grid place-items-center text-[10px] font-bold text-accent-foreground pulse-dot"
                    style={{ left: p.l, top: p.t }}
                  >
                    {i + 1}
                  </div>
                ))}
              </>
            )}

            {/* Tracked cursor */}
            {realCursor && (
              <div
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-300 pointer-events-none",
                  state.penControlOn ? "opacity-100" : "opacity-60"
                )}
                style={{ left: `${realCursor.x * 100}%`, top: `${realCursor.y * 100}%` }}
              >
                <div className={cn(
                  "h-4 w-4 rounded-full border-2",
                  state.writingActive
                    ? "bg-primary border-primary shadow-glow"
                    : "bg-primary/30 border-primary"
                )} />
                <Crosshair className="absolute -top-3 -left-3 h-10 w-10 text-primary/40" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Info message bar */}
      <div className="text-xs text-muted-foreground px-2">{state.infoMessage}</div>
    </main>
  );
}
