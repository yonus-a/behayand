/**
 * Theme configuration for the chat module.
 * All values are CSS color values (hex, rgb, hsl, etc.)
 * The ChatRoot component applies these as CSS custom properties.
 */
export interface ChatTheme {
  /** Main background surface */
  surface: string;
  /** Secondary surface for cards, panels */
  surfaceVariant: string;
  /** Tertiary surface for nested elements */
  surfaceVariant2: string;
  /** Fourth-level surface for deep nested elements */
  surfaceVariant3: string;

  /** Primary text color */
  onSurface: string;
  /** Secondary/muted text color */
  onSurfaceSecondary: string;

  /** Primary accent color (buttons, links, indicators) */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Error/danger color */
  error: string;
  /** Success color */
  success: string;

  /** Border/outline color */
  outlineVariant: string;

  /** Shadow for floating elements */
  shadowFloating: string;

  /** Background for sent message bubbles */
  bubbleMine: string;
  /** Background for received message bubbles */
  bubbleTheirs: string;

  /** Font family override */
  fontFamily?: string;

  /** Text direction */
  direction?: "rtl" | "ltr";
}

/**
 * Default theme matching the original behayand-frontend design
 */
export const defaultTheme: ChatTheme = {
  surface: "#ffffff",
  surfaceVariant: "#f5f5f5",
  surfaceVariant2: "#eeeeee",
  surfaceVariant3: "#e0e0e0",

  onSurface: "#1a1a1a",
  onSurfaceSecondary: "#666666",

  primary: "#6366f1",
  secondary: "#8b5cf6",
  error: "#ef4444",
  success: "#22c55e",

  outlineVariant: "#e5e7eb",
  shadowFloating: "0 4px 12px rgba(0, 0, 0, 0.1)",

  bubbleMine: "#6366f1",
  bubbleTheirs: "#f3f4f6",

  fontFamily: "inherit",
  direction: "rtl",
};
