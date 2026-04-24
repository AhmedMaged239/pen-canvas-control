import { useApp } from "@/lib/store";
import { bridge } from "@/lib/bridge";
import { Section, Row } from "./Section";
import { Segmented } from "./Segmented";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Wrench, Sliders, Camera, MousePointer2, Sparkles, Monitor,
  RefreshCw, Crosshair, Pipette, Power, PenLine,
  RotateCcw, Check, X, StopCircle,
} from "lucide-react";
import type { CalibrationMode, MouseMode, PerfProfile } from "@/lib/bridge";

export function Sidebar() {
  const { state, set } = useApp();

  return (
    <aside className="w-[320px] shrink-0 h-full overflow-y-auto p-4 space-y-3 border-r border-border/60 bg-sidebar/50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pb-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-primary shadow-glow grid place-items-center">
          <PenLine className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-base font-bold tracking-tight">AirDesk</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Webcam Pen Studio</div>
        </div>
      </div>

      {/* SETUP */}
      <Section title="Setup" icon={<Wrench className="h-3.5 w-3.5" />}>
        <Button
          className="w-full"
          variant={state.previewClickMode === "sampleColor" ? "default" : "secondary"}
          onClick={() => {
            const next = state.previewClickMode === "sampleColor" ? "none" : "sampleColor";
            set({ previewClickMode: next });
            bridge.setPreviewClickMode(next);
          }}
        >
          <Pipette className="h-4 w-4 mr-2" />
          {state.previewClickMode === "sampleColor" ? "Click pen tip in preview…" : "Set Pen Color"}
        </Button>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Paper calibration</div>
          <Segmented<CalibrationMode>
            value={state.calibrationMode}
            onChange={(v) => { set({ calibrationMode: v }); bridge.setCalibrationMode(v); }}
            options={[
              { value: "auto", label: "Auto-detect" },
              { value: "manual", label: "Manual (4 corners)" },
            ]}
            size="sm"
          />
        </div>

        {state.calibrationStatus === "acceptReject" && (
          <div className="grid grid-cols-2 gap-2 animate-fade-in">
            <Button onClick={() => { bridge.acceptCalibration(); set({ calibrationStatus: "idle" }); }} className="bg-success text-success-foreground hover:bg-success/90">
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
            <Button onClick={() => { bridge.rejectCalibration(); set({ calibrationStatus: "calibrating" }); }} variant="destructive">
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => { bridge.startRecalibration(); set({ calibrationStatus: "calibrating" }); }}>
            <RotateCcw className="h-4 w-4 mr-1" /> Recalibrate
          </Button>
          <Button
            variant="outline"
            disabled={state.calibrationStatus === "idle"}
            onClick={() => { bridge.stopCalibration(); set({ calibrationStatus: "idle" }); }}
          >
            <StopCircle className="h-4 w-4 mr-1" /> Stop
          </Button>
        </div>
      </Section>

      {/* TOOLS */}
      <Section title="Tools" icon={<Sliders className="h-3.5 w-3.5" />}>
        <Button
          className="w-full"
          variant={state.debugOn ? "default" : "secondary"}
          onClick={() => { const v = !state.debugOn; set({ debugOn: v }); bridge.setDebugView(v); }}
        >
          Debug: {state.debugOn ? "ON" : "OFF"}
        </Button>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Tracking profile</div>
          <Segmented<PerfProfile>
            value={state.perfProfile}
            onChange={(v) => { set({ perfProfile: v }); bridge.setPerfProfile(v); }}
            options={[
              { value: "speed", label: "Speed" },
              { value: "balanced", label: "Balanced" },
              { value: "quality", label: "Quality" },
            ]}
            size="sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Speed / Quality</span>
            <span className="text-xs font-mono text-primary">{state.perfMix}</span>
          </div>
          <Slider
            value={[state.perfMix]}
            min={0} max={100} step={1}
            onValueChange={([v]) => { set({ perfMix: v }); bridge.setPerfMix(v); }}
          />
        </div>

        <Row label="Strict lock" hint="Maximum accuracy">
          <Switch checked={state.strictLock} onCheckedChange={(v) => { set({ strictLock: v }); bridge.setStrictLock(v); }} />
        </Row>
        <Row label="Ultra-smooth writing" hint="Reduces jitter">
          <Switch checked={state.ultraSmooth} onCheckedChange={(v) => { set({ ultraSmooth: v }); bridge.setUltraSmooth(v); }} />
        </Row>
      </Section>

      {/* CAMERA */}
      <Section title="Camera" icon={<Camera className="h-3.5 w-3.5" />}>
        <div className="flex gap-2">
          <Select
            value={String(state.cameraIndex)}
            onValueChange={(v) => { const i = Number(v); set({ cameraIndex: i }); bridge.selectCamera(i); }}
          >
            <SelectTrigger className="flex-1"><SelectValue placeholder="Pick a camera" /></SelectTrigger>
            <SelectContent>
              {state.cameraList.map((c) => (
                <SelectItem key={c.index} value={String(c.index)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => bridge.refreshCameraList()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Row label="Enable camera input">
          <Switch
            checked={state.cameraEnabled}
            onCheckedChange={(v) => { set({ cameraEnabled: v }); bridge.enableCamera(v); }}
          />
        </Row>

        <Row label="Resolution">
          <Select
            value={`${state.cameraResolution.width}x${state.cameraResolution.height}`}
            onValueChange={(v) => {
              const [w, h] = v.split("x").map(Number);
              set({ cameraResolution: { width: w, height: h } });
              bridge.setCameraResolution(w, h);
            }}
          >
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["640x480", "800x600", "1280x720", "1920x1080"].map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row label="Rotation">
          <Select
            value={String(state.cameraRotation)}
            onValueChange={(v) => {
              const deg = Number(v) as 0 | 90 | 180 | 270;
              set({ cameraRotation: deg }); bridge.setCameraRotation(deg);
            }}
          >
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[0, 90, 180, 270].map((d) => <SelectItem key={d} value={String(d)}>{d}°</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>

        <Row label="Flip X">
          <Switch checked={state.cameraFlipX} onCheckedChange={(v) => { set({ cameraFlipX: v }); bridge.setCameraFlip(v, state.cameraFlipY); }} />
        </Row>
        <Row label="Flip Y">
          <Switch checked={state.cameraFlipY} onCheckedChange={(v) => { set({ cameraFlipY: v }); bridge.setCameraFlip(state.cameraFlipX, v); }} />
        </Row>
      </Section>

      {/* MOUSE */}
      <Section title="Mouse" icon={<MousePointer2 className="h-3.5 w-3.5" />} defaultOpen={false}>
        <Row label="Range (W × H)">
          <div className="flex items-center gap-1">
            <Input
              type="number" className="w-16 h-8"
              value={state.mouseRange.width}
              onChange={(e) => {
                const w = Number(e.target.value);
                set({ mouseRange: { ...state.mouseRange, width: w } });
                bridge.setMouseArea(w, state.mouseRange.height);
              }}
            />
            <span className="text-muted-foreground">×</span>
            <Input
              type="number" className="w-16 h-8"
              value={state.mouseRange.height}
              onChange={(e) => {
                const h = Number(e.target.value);
                set({ mouseRange: { ...state.mouseRange, height: h } });
                bridge.setMouseArea(state.mouseRange.width, h);
              }}
            />
          </div>
        </Row>
        <Row label="Left-handed">
          <Switch checked={state.leftHanded} onCheckedChange={(v) => { set({ leftHanded: v }); bridge.setLeftHanded(v); }} />
        </Row>
        <Row label="Enable writing">
          <Switch checked={state.writeEnabled} onCheckedChange={(v) => { set({ writeEnabled: v }); bridge.setWriteEnabled(v); }} />
        </Row>
        <Row label="Invert X">
          <Switch checked={state.invertX} onCheckedChange={(v) => { set({ invertX: v }); bridge.setInvertX(v); }} />
        </Row>
        <Row label="Invert Y">
          <Switch checked={state.invertY} onCheckedChange={(v) => { set({ invertY: v }); bridge.setInvertY(v); }} />
        </Row>
        <Row label="Edge scroll">
          <Switch checked={state.edgeScrollOn} onCheckedChange={(v) => { set({ edgeScrollOn: v }); bridge.setEdgeScroll(v); }} />
        </Row>
        {state.edgeScrollOn && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Scroll speed</span>
              <span className="text-xs font-mono text-primary">{state.edgeScrollSpeed.toFixed(1)}</span>
            </div>
            <Slider
              value={[state.edgeScrollSpeed]} min={0.1} max={5} step={0.1}
              onValueChange={([v]) => { set({ edgeScrollSpeed: v }); bridge.setEdgeScrollSpeed(v); }}
            />
          </div>
        )}
        <Button
          className="w-full"
          variant={state.penControlOn ? "default" : "secondary"}
          onClick={() => { const v = !state.penControlOn; set({ penControlOn: v }); bridge.togglePenControl(); }}
        >
          <Power className="h-4 w-4 mr-2" />
          Pen Control: {state.penControlOn ? "ON" : "OFF"}
        </Button>
      </Section>

      {/* MOUSE MODE */}
      <Section title="Mouse Mode" icon={<Crosshair className="h-3.5 w-3.5" />} defaultOpen={false}>
        <Segmented<MouseMode>
          value={state.mouseMode}
          onChange={(v) => { set({ mouseMode: v }); bridge.setMouseMode(v); }}
          options={[
            { value: "fullscreen", label: "Fullscreen" },
            { value: "fixed", label: "Fixed" },
            { value: "touchpad", label: "Touchpad" },
          ]}
          size="sm"
        />
      </Section>

      {/* EXTRAS */}
      <Section title="Extras" icon={<Sparkles className="h-3.5 w-3.5" />} defaultOpen={false}>
        <Row label="Dark theme">
          <Switch
            checked={state.theme === "dark"}
            onCheckedChange={(v) => { const t = v ? "dark" : "light"; set({ theme: t }); bridge.setTheme(t); }}
          />
        </Row>
        <Button variant="outline" className="w-full" onClick={() => set({ shortcutHelpVisible: true })}>
          Show keyboard shortcuts
        </Button>
        <Button
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
          onClick={() => { set({ whiteboardVisible: !state.whiteboardVisible }); bridge.toggleWhiteboard(); }}
        >
          <Monitor className="h-4 w-4 mr-2" />
          {state.whiteboardVisible ? "Hide" : "Open"} Whiteboard
        </Button>
      </Section>
    </aside>
  );
}
