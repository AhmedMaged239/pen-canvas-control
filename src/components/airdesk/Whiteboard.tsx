import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Undo2, Redo2, Eraser, PenTool, Trash2, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/themes/useTheme";

interface Stroke {
  color: string;
  width: number;
  mode: "pen" | "eraser";
  points: { x: number; y: number }[];
}

export function Whiteboard() {
  const { state, set } = useApp();
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [drawing, setDrawing] = useState<Stroke | null>(null);

  // Palette derived from active theme — primary, accent, success, warning, danger,
  // text, plus a neutral ink color, so the picker always feels native to the theme.
  const tc = currentTheme.colors;
  const COLORS = [
    tc["--text-primary"],
    tc["--color-primary"],
    tc["--color-accent"],
    tc["--color-success"],
    tc["--color-warning"],
    tc["--color-danger"],
    tc["--color-secondary"],
  ];

  const [color, setColor] = useState(tc["--color-primary"]);
  const [width, setWidth] = useState(3);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");

  // Keep the active pen color in sync with theme changes.
  useEffect(() => {
    setColor(currentTheme.colors["--color-primary"]);
  }, [currentTheme.id]);

  // Demo stroke when previewing a theme from the Theme tab.
  useEffect(() => {
    if (!state.whiteboardVisible) return;
    if (!state.infoMessage.startsWith("Previewing theme")) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const palette = [tc["--color-primary"], tc["--color-accent"], tc["--color-success"]];
    const demo: Stroke[] = palette.map((col, i) => ({
      color: col,
      width: 6,
      mode: "pen",
      points: Array.from({ length: 60 }, (_, k) => ({
        x: w * 0.15 + (w * 0.7 * k) / 59,
        y: h * (0.35 + i * 0.15) + Math.sin(k / 5 + i) * 18,
      })),
    }));
    setStrokes(demo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.whiteboardVisible, currentTheme.id]);


  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const all = drawing ? [...strokes, drawing] : strokes;
    for (const s of all) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = s.width * (s.mode === "eraser" ? 6 : 1);
      ctx.strokeStyle = s.color;
      ctx.globalCompositeOperation = s.mode === "eraser" ? "destination-out" : "source-over";
      ctx.beginPath();
      s.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  };

  useEffect(() => { draw(); }); // each render

  // Resize canvas to fit
  useEffect(() => {
    if (!state.whiteboardVisible) return;
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = c.offsetWidth * window.devicePixelRatio;
      c.height = c.offsetHeight * window.devicePixelRatio;
      const ctx = c.getContext("2d");
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.whiteboardVisible]);

  if (!state.whiteboardVisible) return null;

  const start = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    setDrawing({ color, width, mode, points: [p] });
    setRedo([]);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing) return;
    const r = canvasRef.current!.getBoundingClientRect();
    setDrawing({ ...drawing, points: [...drawing.points, { x: e.clientX - r.left, y: e.clientY - r.top }] });
  };
  const end = () => {
    if (drawing) setStrokes((s) => [...s, drawing]);
    setDrawing(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col animate-fade-in"
      style={{ background: "var(--bg-overlay)", backdropFilter: "blur(20px)" }}
    >
      {/* Top toolbar */}
      <div
        className="border-b px-4 py-3 flex items-center gap-2 flex-wrap"
        style={{
          background: "var(--wb-toolbar-bg)",
          borderColor: "var(--border-color)",
          backdropFilter: "blur(18px) saturate(140%)",
        }}
      >
        <div className="flex items-center gap-1 mr-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <PenTool className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Whiteboard</span>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <Button variant="ghost" size="icon" onClick={() => {
          setStrokes((s) => {
            if (s.length === 0) return s;
            setRedo((r) => [...r, s[s.length - 1]]);
            return s.slice(0, -1);
          });
        }}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => {
          setRedo((r) => {
            if (r.length === 0) return r;
            setStrokes((s) => [...s, r[r.length - 1]]);
            return r.slice(0, -1);
          });
        }}>
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant={mode === "pen" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("pen")}
        >
          <PenTool className="h-4 w-4 mr-1" /> Pen
        </Button>
        <Button
          variant={mode === "eraser" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("eraser")}
        >
          <Eraser className="h-4 w-4 mr-1" /> Eraser
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setMode("pen"); }}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-spring",
                color === c ? "border-foreground scale-110 shadow-glow" : "border-border hover:scale-105"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-2 min-w-[160px]">
          <span className="text-xs text-muted-foreground w-10">Width</span>
          <Slider value={[width]} min={1} max={20} step={1} onValueChange={([v]) => setWidth(v)} className="flex-1" />
          <span className="text-xs font-mono text-primary w-6 text-right">{width}</span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setStrokes([]); setRedo([]); }}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
          <Button variant="outline" size="icon" onClick={() => set({ whiteboardVisible: false })}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="h-full w-full rounded-2xl border touch-none"
          style={{
            background: "var(--wb-canvas-bg)",
            borderColor: "var(--border-color)",
            boxShadow: "var(--shadow-md)",
            cursor: drawing
              ? `crosshair`
              : `crosshair`,
            // Distinct cursor tint when writing engaged: use writing color outline.
            outline: state.writingActive
              ? `2px solid var(--wb-cursor-writing)`
              : "none",
            outlineOffset: "-2px",
          }}
        />
      </div>

      <div className="px-6 pb-3 text-xs text-muted-foreground text-center">
        Tip: hold <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">Ctrl</kbd> to engage writing · <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">Alt+W</kbd> to close · current mode: <span className="text-primary">{mode}</span>
      </div>
    </div>
  );
}
