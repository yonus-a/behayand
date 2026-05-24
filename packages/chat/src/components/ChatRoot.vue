<script setup lang="ts">
import { provide, computed, watch, onMounted } from "vue";
import { useChatTheme } from "../composables/useChatTheme";
import { useChatStore } from "../stores/chatStore";
import { useChatActionStore } from "../stores/chatActionStore";
import {
  CHAT_ADAPTER_KEY,
  CHAT_THEME_KEY,
  CHAT_USER_ID_KEY,
  CHAT_LOCALE_KEY,
  CHAT_I18N_KEY,
} from "../composables/useChat";
import type { ChatDataAdapter } from "../types/adapter";
import type { ChatTheme } from "../types/theme";
import { defaultTheme } from "../types/theme";

const props = withDefaults(
  defineProps<{
    /** Data adapter - required for fetching/sending data */
    adapter: ChatDataAdapter;
    /** Theme overrides */
    theme?: Partial<ChatTheme>;
    /** Current authenticated user ID */
    userId: number;
    /** Locale for formatting (default: 'en') */
    locale?: string;
    /** Translation function */
    t?: (key: string) => string;
  }>(),
  {
    locale: "en",
    t: (key: string) => key,
  },
);

// Merge theme
const mergedTheme = computed<ChatTheme>(() => ({
  ...defaultTheme,
  ...props.theme,
}));

// Provide to descendants
provide(CHAT_ADAPTER_KEY, props.adapter);
provide(CHAT_THEME_KEY, mergedTheme.value);
provide(CHAT_USER_ID_KEY, props.userId);
provide(CHAT_LOCALE_KEY, props.locale);
provide(CHAT_I18N_KEY, props.t);

// Initialize stores
const chatStore = useChatStore();
const actionStore = useChatActionStore();

onMounted(() => {
  chatStore.setAdapter(props.adapter);
  actionStore.setUserId(props.userId);
});

watch(
  () => props.userId,
  (newId) => actionStore.setUserId(newId),
);

// Theme CSS vars
const { cssVars } = useChatTheme();

const rootStyle = computed(() => ({
  ...cssVars.value,
  direction: mergedTheme.value.direction || "rtl",
  fontFamily: mergedTheme.value.fontFamily || "inherit",
}));
</script>

<template>
  <div class="chat-root" :style="rootStyle">
    <slot />
  </div>
</template>

<style>
.chat-root {
  width: 100%;
  height: 100%;
  font-family: var(--chat-font-family, inherit);
  color: var(--chat-on-surface);
  background-color: var(--chat-surface);
}

/* Base theme CSS custom properties applied to .chat-root */
.chat-root * {
  box-sizing: border-box;
}
</style>
