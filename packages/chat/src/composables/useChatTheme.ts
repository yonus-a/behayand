import { computed, inject } from "vue";
import { CHAT_THEME_KEY } from "./useChat";
import type { ChatTheme } from "../types/theme";
import { defaultTheme } from "../types/theme";

/**
 * Composable that provides the current chat theme as CSS custom properties.
 * Use within any component inside ChatRoot to access theme values.
 */
export function useChatTheme() {
  const theme = inject<ChatTheme>(CHAT_THEME_KEY, defaultTheme);

  /**
   * CSS custom properties object to be bound to a root element's style.
   * Usage: <div :style="cssVars">...</div>
   */
  const cssVars = computed(() => ({
    "--chat-surface": theme.surface,
    "--chat-surface-variant": theme.surfaceVariant,
    "--chat-surface-variant-2": theme.surfaceVariant2,
    "--chat-surface-variant-3": theme.surfaceVariant3,
    "--chat-on-surface": theme.onSurface,
    "--chat-on-surface-secondary": theme.onSurfaceSecondary,
    "--chat-primary": theme.primary,
    "--chat-secondary": theme.secondary,
    "--chat-error": theme.error,
    "--chat-success": theme.success,
    "--chat-outline-variant": theme.outlineVariant,
    "--chat-shadow-floating": theme.shadowFloating,
    "--chat-bubble-mine": theme.bubbleMine,
    "--chat-bubble-theirs": theme.bubbleTheirs,
    "--chat-font-family": theme.fontFamily || "inherit",
    "--chat-direction": theme.direction || "rtl",
  }));

  return {
    theme,
    cssVars,
  };
}
