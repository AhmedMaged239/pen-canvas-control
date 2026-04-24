// AirDesk theme catalog — 20 hand-tuned LIGHT themes.
// Each theme defines every CSS custom property consumed across the app.
// Cosmic Vanilla is the default.

export interface ThemeColors {
  // Backgrounds
  "--bg-primary": string;
  "--bg-surface": string;
  "--bg-overlay": string;

  // Brand
  "--color-primary": string;
  "--color-primary-hover": string;
  "--color-primary-light": string;
  "--color-secondary": string;
  "--color-accent": string;

  // Status
  "--color-success": string;
  "--color-success-bg": string;
  "--color-warning": string;
  "--color-warning-bg": string;
  "--color-danger": string;
  "--color-danger-bg": string;

  // Text
  "--text-primary": string;
  "--text-secondary": string;
  "--text-muted": string;
  "--text-inverse": string;

  // Borders
  "--border-color": string;
  "--border-color-hover": string;

  // Shadows
  "--shadow-sm": string;
  "--shadow-md": string;
  "--shadow-lg": string;
  "--shadow-glow-primary": string;
  "--shadow-glow-success": string;

  // Preview panel
  "--preview-border-active": string;
  "--preview-border-idle": string;

  // Whiteboard
  "--wb-toolbar-bg": string;
  "--wb-canvas-bg": string;
  "--wb-cursor-default": string;
  "--wb-cursor-writing": string;

  // Toggles
  "--toggle-bg-off": string;
  "--toggle-bg-on": string;
  "--toggle-knob": string;

  // Sidebar cards
  "--sidebar-card-bg": string;
  "--sidebar-card-border": string;
  "--sidebar-card-hover": string;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  isDefault: boolean;
  colors: ThemeColors;
}

// Helper to build the same shadow / overlay patterns per theme without repeating.
function build(opts: {
  bg: string;
  surface: string;
  overlay: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderHover: string;
  shadowRgb: string; // r,g,b for shadow color
  glowRgb: string; // r,g,b for primary glow
  successRgb?: string;
  wbCanvas?: string;
  wbToolbar?: string;
  toggleOff?: string;
}): ThemeColors {
  const success = "#22C55E";
  const successBg = "#DCFCE7";
  const warning = "#F59E0B";
  const warningBg = "#FEF3C7";
  const danger = "#EF4444";
  const dangerBg = "#FEE2E2";
  const successRgb = opts.successRgb ?? "34,197,94";

  return {
    "--bg-primary": opts.bg,
    "--bg-surface": opts.surface,
    "--bg-overlay": opts.overlay,

    "--color-primary": opts.primary,
    "--color-primary-hover": opts.primaryHover,
    "--color-primary-light": opts.primaryLight,
    "--color-secondary": opts.secondary,
    "--color-accent": opts.accent,

    "--color-success": success,
    "--color-success-bg": successBg,
    "--color-warning": warning,
    "--color-warning-bg": warningBg,
    "--color-danger": danger,
    "--color-danger-bg": dangerBg,

    "--text-primary": opts.text,
    "--text-secondary": opts.textSecondary,
    "--text-muted": opts.textMuted,
    "--text-inverse": opts.textInverse,

    "--border-color": opts.border,
    "--border-color-hover": opts.borderHover,

    "--shadow-sm": `0 1px 2px rgba(${opts.shadowRgb}, 0.06)`,
    "--shadow-md": `0 4px 12px rgba(${opts.shadowRgb}, 0.10)`,
    "--shadow-lg": `0 12px 32px rgba(${opts.shadowRgb}, 0.14)`,
    "--shadow-glow-primary": `0 0 32px rgba(${opts.glowRgb}, 0.35)`,
    "--shadow-glow-success": `0 0 24px rgba(${successRgb}, 0.35)`,

    "--preview-border-active": opts.primary,
    "--preview-border-idle": opts.border,

    "--wb-toolbar-bg": opts.wbToolbar ?? opts.overlay,
    "--wb-canvas-bg": opts.wbCanvas ?? opts.surface,
    "--wb-cursor-default": opts.primary,
    "--wb-cursor-writing": opts.accent,

    "--toggle-bg-off": opts.toggleOff ?? opts.border,
    "--toggle-bg-on": opts.primary,
    "--toggle-knob": "#FFFFFF",

    "--sidebar-card-bg": opts.surface,
    "--sidebar-card-border": opts.border,
    "--sidebar-card-hover": opts.primaryLight,
  };
}

export const themes: Theme[] = [
  {
    id: "cosmic-vanilla",
    name: "Cosmic Vanilla",
    emoji: "🌌",
    tagline: "Cream paper meets indigo dreams",
    isDefault: true,
    colors: build({
      bg: "#FFFCF5",
      surface: "#FFFFFF",
      overlay: "rgba(255, 252, 245, 0.78)",
      primary: "#4F46E5",
      primaryHover: "#4338CA",
      primaryLight: "#EEF2FF",
      secondary: "#E2E8F0",
      accent: "#FF6B6B",
      text: "#1E293B",
      textSecondary: "#475569",
      textMuted: "#94A3B8",
      textInverse: "#FFFFFF",
      border: "#E2E8F0",
      borderHover: "#CBD5E1",
      shadowRgb: "30, 41, 59",
      glowRgb: "79, 70, 229",
      wbCanvas: "#FFFCF5",
    }),
  },
  {
    id: "peachy-studio",
    name: "Peachy Studio",
    emoji: "🍑",
    tagline: "Sun-warmed peach and golden hour",
    isDefault: false,
    colors: build({
      bg: "#FFF6EE",
      surface: "#FFFFFF",
      overlay: "rgba(255, 246, 238, 0.8)",
      primary: "#F97362",
      primaryHover: "#E85B49",
      primaryLight: "#FFE4DC",
      secondary: "#FFD6A5",
      accent: "#FFB347",
      text: "#3D2418",
      textSecondary: "#7A4F3B",
      textMuted: "#B89280",
      textInverse: "#FFFFFF",
      border: "#FBE2D2",
      borderHover: "#F5C9B0",
      shadowRgb: "180, 90, 50",
      glowRgb: "249, 115, 98",
      wbCanvas: "#FFF8F2",
    }),
  },
  {
    id: "mint-chalkboard",
    name: "Mint Chalkboard",
    emoji: "🌿",
    tagline: "Crisp mint study session",
    isDefault: false,
    colors: build({
      bg: "#F1FBF6",
      surface: "#FFFFFF",
      overlay: "rgba(241, 251, 246, 0.8)",
      primary: "#10B981",
      primaryHover: "#0E9F71",
      primaryLight: "#D1FAE5",
      secondary: "#A7F3D0",
      accent: "#34D399",
      text: "#0F3D2E",
      textSecondary: "#3F6D5C",
      textMuted: "#8FB5A4",
      textInverse: "#FFFFFF",
      border: "#D5EFE1",
      borderHover: "#B7E2C8",
      shadowRgb: "16, 95, 70",
      glowRgb: "16, 185, 129",
      wbCanvas: "#F8FFFB",
    }),
  },
  {
    id: "blueberry-frost",
    name: "Blueberry Frost",
    emoji: "🫐",
    tagline: "Cool focus, frosted blue",
    isDefault: false,
    colors: build({
      bg: "#F1F6FF",
      surface: "#FFFFFF",
      overlay: "rgba(241, 246, 255, 0.8)",
      primary: "#3B82F6",
      primaryHover: "#2563EB",
      primaryLight: "#DBEAFE",
      secondary: "#BFDBFE",
      accent: "#60A5FA",
      text: "#0F2547",
      textSecondary: "#3B5784",
      textMuted: "#8AA4C9",
      textInverse: "#FFFFFF",
      border: "#DCE7F8",
      borderHover: "#BFD3EF",
      shadowRgb: "37, 99, 235",
      glowRgb: "59, 130, 246",
      wbCanvas: "#F8FBFF",
    }),
  },
  {
    id: "lavender-latte",
    name: "Lavender Latte",
    emoji: "💜",
    tagline: "Velvet calm and creamy violet",
    isDefault: false,
    colors: build({
      bg: "#F7F3FB",
      surface: "#FFFFFF",
      overlay: "rgba(247, 243, 251, 0.8)",
      primary: "#8B5CF6",
      primaryHover: "#7C3AED",
      primaryLight: "#EDE9FE",
      secondary: "#DDD6FE",
      accent: "#C084FC",
      text: "#2E1A4F",
      textSecondary: "#5B4585",
      textMuted: "#9F8FBC",
      textInverse: "#FFFFFF",
      border: "#E7DEF3",
      borderHover: "#D2C2EA",
      shadowRgb: "91, 55, 175",
      glowRgb: "139, 92, 246",
      wbCanvas: "#FCFAFE",
    }),
  },
  {
    id: "lemon-zest",
    name: "Lemon Zest",
    emoji: "🍋",
    tagline: "Bright squeeze of sunshine",
    isDefault: false,
    colors: build({
      bg: "#FFFCEB",
      surface: "#FFFFFF",
      overlay: "rgba(255, 252, 235, 0.8)",
      primary: "#F59E0B",
      primaryHover: "#D97706",
      primaryLight: "#FEF3C7",
      secondary: "#FDE68A",
      accent: "#FBBF24",
      text: "#3F2D04",
      textSecondary: "#7B5A1A",
      textMuted: "#BFA56A",
      textInverse: "#FFFFFF",
      border: "#F4E7B6",
      borderHover: "#EBD58A",
      shadowRgb: "180, 130, 20",
      glowRgb: "245, 158, 11",
      wbCanvas: "#FFFEF5",
    }),
  },
  {
    id: "berry-pop",
    name: "Berry Pop",
    emoji: "🍓",
    tagline: "Punchy pink with juicy energy",
    isDefault: false,
    colors: build({
      bg: "#FFF3F8",
      surface: "#FFFFFF",
      overlay: "rgba(255, 243, 248, 0.8)",
      primary: "#EC4899",
      primaryHover: "#DB2777",
      primaryLight: "#FCE7F3",
      secondary: "#FBCFE8",
      accent: "#F472B6",
      text: "#3F0F2A",
      textSecondary: "#7B345A",
      textMuted: "#C28BA8",
      textInverse: "#FFFFFF",
      border: "#F8DBE7",
      borderHover: "#F1BBD0",
      shadowRgb: "190, 40, 110",
      glowRgb: "236, 72, 153",
      wbCanvas: "#FFF9FC",
    }),
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    emoji: "🌊",
    tagline: "Salt air, sea glass, calm waves",
    isDefault: false,
    colors: build({
      bg: "#EFFBFB",
      surface: "#FFFFFF",
      overlay: "rgba(239, 251, 251, 0.8)",
      primary: "#0EA5E9",
      primaryHover: "#0284C7",
      primaryLight: "#E0F2FE",
      secondary: "#A5F3FC",
      accent: "#22D3EE",
      text: "#0B3247",
      textSecondary: "#356381",
      textMuted: "#88AEC2",
      textInverse: "#FFFFFF",
      border: "#D2ECF2",
      borderHover: "#AEDDE8",
      shadowRgb: "14, 116, 144",
      glowRgb: "14, 165, 233",
      wbCanvas: "#F6FDFE",
    }),
  },
  {
    id: "sakura-desk",
    name: "Sakura Desk",
    emoji: "🌸",
    tagline: "Petal-soft pink, quiet bloom",
    isDefault: false,
    colors: build({
      bg: "#FFF6F8",
      surface: "#FFFFFF",
      overlay: "rgba(255, 246, 248, 0.82)",
      primary: "#F87171",
      primaryHover: "#EF4444",
      primaryLight: "#FEE2E2",
      secondary: "#FECACA",
      accent: "#FB7185",
      text: "#3D1A23",
      textSecondary: "#7A3F4B",
      textMuted: "#C49AA4",
      textInverse: "#FFFFFF",
      border: "#FBE0E4",
      borderHover: "#F5C2C9",
      shadowRgb: "190, 70, 90",
      glowRgb: "248, 113, 113",
      wbCanvas: "#FFFAFB",
    }),
  },
  {
    id: "warm-timber",
    name: "Warm Timber",
    emoji: "🪵",
    tagline: "Cabin desk, oak grain, slow coffee",
    isDefault: false,
    colors: build({
      bg: "#FAF4EC",
      surface: "#FFFFFF",
      overlay: "rgba(250, 244, 236, 0.82)",
      primary: "#A0522D",
      primaryHover: "#8A4525",
      primaryLight: "#F0E2D2",
      secondary: "#D7B894",
      accent: "#D2691E",
      text: "#3A241A",
      textSecondary: "#6E4A36",
      textMuted: "#B5947B",
      textInverse: "#FFFFFF",
      border: "#E9D8C2",
      borderHover: "#D7BFA1",
      shadowRgb: "120, 70, 35",
      glowRgb: "160, 82, 45",
      wbCanvas: "#FCF7F0",
    }),
  },
  {
    id: "nordic-mist",
    name: "Nordic Mist",
    emoji: "🧊",
    tagline: "Soft fog blues and crisp focus",
    isDefault: false,
    colors: build({
      bg: "#F5F8FC",
      surface: "#FFFFFF",
      overlay: "rgba(245, 248, 252, 0.84)",
      primary: "#4C6FFF",
      primaryHover: "#3F5AE0",
      primaryLight: "#E7EDFF",
      secondary: "#D9E3F7",
      accent: "#38BDF8",
      text: "#16243D",
      textSecondary: "#3D5377",
      textMuted: "#6A7F9F",
      textInverse: "#FFFFFF",
      border: "#DCE4F3",
      borderHover: "#C4D1E8",
      shadowRgb: "39, 68, 122",
      glowRgb: "76, 111, 255",
      wbCanvas: "#FAFCFF",
    }),
  },
  {
    id: "pistachio-cream",
    name: "Pistachio Cream",
    emoji: "🥜",
    tagline: "Gentle greens for long sessions",
    isDefault: false,
    colors: build({
      bg: "#F6FBF2",
      surface: "#FFFFFF",
      overlay: "rgba(246, 251, 242, 0.84)",
      primary: "#4BAF6E",
      primaryHover: "#3D975C",
      primaryLight: "#DDF4E4",
      secondary: "#CDEAD6",
      accent: "#84CC16",
      text: "#1D3525",
      textSecondary: "#42624D",
      textMuted: "#6E8F79",
      textInverse: "#FFFFFF",
      border: "#D9ECDD",
      borderHover: "#C2DFC8",
      shadowRgb: "52, 101, 70",
      glowRgb: "75, 175, 110",
      wbCanvas: "#FBFFF9",
    }),
  },
  {
    id: "dusk-berry",
    name: "Dusk Berry",
    emoji: "🍇",
    tagline: "Calm plum mood with clear contrast",
    isDefault: false,
    colors: build({
      bg: "#F9F5FC",
      surface: "#FFFFFF",
      overlay: "rgba(249, 245, 252, 0.84)",
      primary: "#7C4DCC",
      primaryHover: "#683FB0",
      primaryLight: "#EBDDFA",
      secondary: "#DDCDF2",
      accent: "#A855F7",
      text: "#2A1E42",
      textSecondary: "#534074",
      textMuted: "#7F6AA2",
      textInverse: "#FFFFFF",
      border: "#E5D9F2",
      borderHover: "#D1C1E7",
      shadowRgb: "85, 58, 135",
      glowRgb: "124, 77, 204",
      wbCanvas: "#FDFBFF",
    }),
  },
  {
    id: "graphite-paper",
    name: "Graphite Paper",
    emoji: "✏️",
    tagline: "Neutral grey with ink-like clarity",
    isDefault: false,
    colors: build({
      bg: "#F6F7F9",
      surface: "#FFFFFF",
      overlay: "rgba(246, 247, 249, 0.86)",
      primary: "#4B5563",
      primaryHover: "#374151",
      primaryLight: "#E5E7EB",
      secondary: "#DDE2E8",
      accent: "#0EA5E9",
      text: "#1F2937",
      textSecondary: "#4B5563",
      textMuted: "#6B7280",
      textInverse: "#FFFFFF",
      border: "#DEE3EA",
      borderHover: "#C8D0DB",
      shadowRgb: "55, 65, 81",
      glowRgb: "75, 85, 99",
      wbCanvas: "#FBFCFD",
    }),
  },
  {
    id: "sunrise-apricot",
    name: "Sunrise Apricot",
    emoji: "🌅",
    tagline: "Warm dawn tones without glare",
    isDefault: false,
    colors: build({
      bg: "#FFF8F2",
      surface: "#FFFFFF",
      overlay: "rgba(255, 248, 242, 0.84)",
      primary: "#E67E4C",
      primaryHover: "#CF6A3B",
      primaryLight: "#FDE4D5",
      secondary: "#F6D3BF",
      accent: "#F59E0B",
      text: "#3B2416",
      textSecondary: "#6C4733",
      textMuted: "#9A7158",
      textInverse: "#FFFFFF",
      border: "#F1DDCF",
      borderHover: "#E6C7B1",
      shadowRgb: "150, 88, 52",
      glowRgb: "230, 126, 76",
      wbCanvas: "#FFFCF8",
    }),
  },
  {
    id: "neon-lagoon",
    name: "Neon Lagoon",
    emoji: "🦜",
    tagline: "Electric aqua pop with tropical punch",
    isDefault: false,
    colors: build({
      bg: "#F1FEFE",
      surface: "#FFFFFF",
      overlay: "rgba(241, 254, 254, 0.86)",
      primary: "#00B8D9",
      primaryHover: "#009BB8",
      primaryLight: "#D6F8FF",
      secondary: "#B8F0FA",
      accent: "#FF4FD8",
      text: "#073844",
      textSecondary: "#2D6573",
      textMuted: "#5A909D",
      textInverse: "#FFFFFF",
      border: "#CDECF2",
      borderHover: "#AEE0EA",
      shadowRgb: "0, 116, 132",
      glowRgb: "0, 184, 217",
      wbCanvas: "#F8FFFF",
    }),
  },
  {
    id: "cyber-citrus",
    name: "Cyber Citrus",
    emoji: "⚡",
    tagline: "Lime energy and high-voltage contrast",
    isDefault: false,
    colors: build({
      bg: "#F9FFE9",
      surface: "#FFFFFF",
      overlay: "rgba(249, 255, 233, 0.86)",
      primary: "#65C300",
      primaryHover: "#55A300",
      primaryLight: "#E7F9C8",
      secondary: "#D7F1A8",
      accent: "#FFC400",
      text: "#24300A",
      textSecondary: "#4B5F20",
      textMuted: "#77884D",
      textInverse: "#FFFFFF",
      border: "#E1EDC5",
      borderHover: "#CBDE9F",
      shadowRgb: "85, 120, 20",
      glowRgb: "101, 195, 0",
      wbCanvas: "#FDFFF6",
    }),
  },
  {
    id: "aurora-pop",
    name: "Aurora Pop",
    emoji: "🌈",
    tagline: "Playful northern lights with bold color",
    isDefault: false,
    colors: build({
      bg: "#F4F8FF",
      surface: "#FFFFFF",
      overlay: "rgba(244, 248, 255, 0.86)",
      primary: "#6E56CF",
      primaryHover: "#5B44B5",
      primaryLight: "#E8E0FF",
      secondary: "#D8CDF8",
      accent: "#00C2A8",
      text: "#221B3F",
      textSecondary: "#4A4270",
      textMuted: "#756C9E",
      textInverse: "#FFFFFF",
      border: "#E0DAF3",
      borderHover: "#CFC5EA",
      shadowRgb: "83, 67, 145",
      glowRgb: "110, 86, 207",
      wbCanvas: "#FAFCFF",
    }),
  },
  {
    id: "ruby-fizz",
    name: "Ruby Fizz",
    emoji: "💎",
    tagline: "Sparkling ruby red and candy vibes",
    isDefault: false,
    colors: build({
      bg: "#FFF2F6",
      surface: "#FFFFFF",
      overlay: "rgba(255, 242, 246, 0.86)",
      primary: "#E5396E",
      primaryHover: "#C72F5E",
      primaryLight: "#FFD8E6",
      secondary: "#F7C6D8",
      accent: "#8E24AA",
      text: "#3B1225",
      textSecondary: "#6C3650",
      textMuted: "#9A6480",
      textInverse: "#FFFFFF",
      border: "#F1D4E0",
      borderHover: "#E7B9CC",
      shadowRgb: "145, 40, 80",
      glowRgb: "229, 57, 110",
      wbCanvas: "#FFF8FB",
    }),
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    emoji: "🔥",
    tagline: "Fiery orange glow with festival energy",
    isDefault: false,
    colors: build({
      bg: "#FFF6EE",
      surface: "#FFFFFF",
      overlay: "rgba(255, 246, 238, 0.86)",
      primary: "#FF6A00",
      primaryHover: "#DD5C00",
      primaryLight: "#FFE3CC",
      secondary: "#FFD0A8",
      accent: "#FF2E63",
      text: "#3D1F0A",
      textSecondary: "#71452B",
      textMuted: "#9D6D4D",
      textInverse: "#FFFFFF",
      border: "#F2DCC9",
      borderHover: "#E8C2A3",
      shadowRgb: "170, 90, 30",
      glowRgb: "255, 106, 0",
      wbCanvas: "#FFFDF9",
    }),
  },
];

export const DEFAULT_THEME_ID = "cosmic-vanilla";
