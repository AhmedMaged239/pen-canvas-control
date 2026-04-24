import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { themes, DEFAULT_THEME_ID, type Theme } from "./index";

const STORAGE_KEY = "airdesk-theme";

export interface ThemeContextValue {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Convert a hex color (#RRGGBB) into the "H S% L%" tuple shadcn expects. */
function hexToHslTuple(hex: string): string | null {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Apply a theme's variables to :root and bridge into shadcn HSL tokens. */
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // 1. Write every CSS custom property defined by the theme.
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(key, value);
  }

  // 2. Map theme palette to shadcn's HSL token system so existing components
  //    (Button, Switch, Slider, Card, etc.) reflect the active theme.
  const c = theme.colors;
  const map: Record<string, string | null> = {
    "--background": hexToHslTuple(c["--bg-primary"]),
    "--foreground": hexToHslTuple(c["--text-primary"]),
    "--card": hexToHslTuple(c["--bg-surface"]),
    "--card-foreground": hexToHslTuple(c["--text-primary"]),
    "--popover": hexToHslTuple(c["--bg-surface"]),
    "--popover-foreground": hexToHslTuple(c["--text-primary"]),
    "--primary": hexToHslTuple(c["--color-primary"]),
    "--primary-foreground": hexToHslTuple(c["--text-inverse"]),
    "--primary-glow": hexToHslTuple(c["--color-primary-light"]),
    "--secondary": hexToHslTuple(c["--color-secondary"]),
    "--secondary-foreground": hexToHslTuple(c["--text-primary"]),
    "--muted": hexToHslTuple(c["--color-primary-light"]),
    "--muted-foreground": hexToHslTuple(c["--text-muted"]),
    "--accent": hexToHslTuple(c["--color-accent"]),
    "--accent-foreground": hexToHslTuple(c["--text-inverse"]),
    "--success": hexToHslTuple(c["--color-success"]),
    "--success-foreground": hexToHslTuple(c["--text-inverse"]),
    "--warning": hexToHslTuple(c["--color-warning"]),
    "--warning-foreground": hexToHslTuple(c["--text-primary"]),
    "--destructive": hexToHslTuple(c["--color-danger"]),
    "--destructive-foreground": hexToHslTuple(c["--text-inverse"]),
    "--border": hexToHslTuple(c["--border-color"]),
    "--input": hexToHslTuple(c["--border-color"]),
    "--ring": hexToHslTuple(c["--color-primary"]),
    "--sidebar-background": hexToHslTuple(c["--bg-surface"]),
    "--sidebar-foreground": hexToHslTuple(c["--text-primary"]),
    "--sidebar-primary": hexToHslTuple(c["--color-primary"]),
    "--sidebar-primary-foreground": hexToHslTuple(c["--text-inverse"]),
    "--sidebar-accent": hexToHslTuple(c["--color-primary-light"]),
    "--sidebar-accent-foreground": hexToHslTuple(c["--text-primary"]),
    "--sidebar-border": hexToHslTuple(c["--border-color"]),
    "--sidebar-ring": hexToHslTuple(c["--color-primary"]),
  };
  for (const [k, v] of Object.entries(map)) {
    if (v) root.style.setProperty(k, v);
  }

  // 3. Tag <html> for any theme-specific selectors.
  root.dataset.theme = theme.id;
}

function loadInitial(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentId, setCurrentId] = useState<string>(loadInitial);

  const currentTheme = useMemo(
    () => themes.find((t) => t.id === currentId) ?? themes.find((t) => t.isDefault) ?? themes[0],
    [currentId],
  );

  // Apply theme whenever it changes.
  useEffect(() => {
    applyTheme(currentTheme);
    try {
      localStorage.setItem(STORAGE_KEY, currentTheme.id);
    } catch {
      /* ignore */
    }
    // Notify backend if PyWebView is present.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const api = (window as any)?.pywebview?.api;
      if (api && typeof api.set_theme === "function") {
        api.set_theme(currentTheme.id);
      }
    } catch {
      /* graceful degradation: backend is optional */
    }
  }, [currentTheme]);

  // Listen for backend-driven theme changes.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ themeId?: string }>).detail;
      if (detail?.themeId && themes.some((t) => t.id === detail.themeId)) {
        setCurrentId(detail.themeId);
      }
    };
    window.addEventListener("theme_changed", handler as EventListener);

    // Also expose a global hook for backends that prefer direct calls.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.airdeskTheme = {
      setTheme: (id: string) => {
        if (themes.some((t) => t.id === id)) setCurrentId(id);
      },
    };

    return () => {
      window.removeEventListener("theme_changed", handler as EventListener);
    };
  }, []);

  const setTheme = useCallback((themeId: string) => {
    if (themes.some((t) => t.id === themeId)) {
      setCurrentId(themeId);
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ currentTheme, themes, setTheme }),
    [currentTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
