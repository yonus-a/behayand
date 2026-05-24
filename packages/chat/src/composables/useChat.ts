import { type App, type InjectionKey, inject, provide, ref } from "vue";
import type { ChatDataAdapter } from "../types/adapter";
import type { ChatTheme } from "../types/theme";
import { defaultTheme } from "../types/theme";
import { useChatStore } from "../stores/chatStore";
import { useChatActionStore } from "../stores/chatActionStore";
import { createPinia, type Pinia } from "pinia";

// ─── Injection Keys ───────────────────────────────────────────────────────────

export const CHAT_ADAPTER_KEY: InjectionKey<ChatDataAdapter> =
  Symbol("chat-adapter");
export const CHAT_THEME_KEY: InjectionKey<ChatTheme> = Symbol("chat-theme");
export const CHAT_USER_ID_KEY: InjectionKey<number> = Symbol("chat-user-id");
export const CHAT_LOCALE_KEY: InjectionKey<string> = Symbol("chat-locale");
export const CHAT_I18N_KEY: InjectionKey<(key: string) => string> =
  Symbol("chat-i18n");

// ─── Plugin Options ───────────────────────────────────────────────────────────

export interface ChatPluginOptions {
  /** The data adapter implementation (required) */
  adapter: ChatDataAdapter;
  /** Theme configuration (optional, defaults to built-in theme) */
  theme?: Partial<ChatTheme>;
  /** Current user ID (required for message ownership) */
  userId: number;
  /** Locale for formatting (default: 'en') */
  locale?: string;
  /** Translation function (optional) - receives a key, returns translated string */
  t?: (key: string) => string;
  /** Existing Pinia instance to use (optional - if not provided, creates internal one) */
  pinia?: Pinia;
}

// ─── Plugin Creator ───────────────────────────────────────────────────────────

/**
 * Creates the chat plugin instance for use with app.use().
 *
 * @example
 * ```typescript
 * import { createChat } from '@yonus-a/chat'
 *
 * const chat = createChat({
 *   adapter: myApiAdapter,
 *   userId: currentUser.id,
 *   theme: { primary: '#3b82f6', direction: 'ltr' },
 * })
 *
 * app.use(chat)
 * ```
 */
export function createChat(options: ChatPluginOptions) {
  return {
    install(app: App) {
      // Ensure pinia is available
      const pinia = options.pinia || createPinia();
      if (!options.pinia) {
        app.use(pinia);
      }

      // Merge theme with defaults
      const mergedTheme: ChatTheme = { ...defaultTheme, ...options.theme };

      // Provide injection keys
      app.provide(CHAT_ADAPTER_KEY, options.adapter);
      app.provide(CHAT_THEME_KEY, mergedTheme);
      app.provide(CHAT_USER_ID_KEY, options.userId);
      app.provide(CHAT_LOCALE_KEY, options.locale || "en");
      app.provide(CHAT_I18N_KEY, options.t || ((key: string) => key));

      // Initialize stores with adapter and userId
      const chatStore = useChatStore(pinia);
      chatStore.setAdapter(options.adapter);

      const actionStore = useChatActionStore(pinia);
      actionStore.setUserId(options.userId);
    },
  };
}

// ─── Composable for accessing chat context ────────────────────────────────────

/**
 * Composable to access the chat configuration from any component within ChatRoot.
 */
export function useChat() {
  const adapter = inject(CHAT_ADAPTER_KEY);
  const theme = inject(CHAT_THEME_KEY, defaultTheme);
  const userId = inject(CHAT_USER_ID_KEY, 0);
  const locale = inject(CHAT_LOCALE_KEY, "en");
  const t = inject(CHAT_I18N_KEY, (key: string) => key);

  if (!adapter) {
    console.warn(
      "[@yonus-a/chat] useChat() called outside of ChatRoot or without createChat() plugin. Adapter not available.",
    );
  }

  return {
    adapter,
    theme,
    userId,
    locale,
    t,
  };
}
