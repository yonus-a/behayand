/**
 * @yonus-a/chat - A themeable, data-agnostic Vue 3 chat module
 *
 * @example
 * ```typescript
 * import { createChat, ChatRoot, ChatMessages, ChatInput, ChatList } from '@yonus-a/chat'
 * import '@yonus-a/chat/style.css'
 *
 * const chat = createChat({
 *   adapter: myApiAdapter,
 *   userId: currentUser.id,
 *   theme: { primary: '#3b82f6' },
 * })
 *
 * app.use(chat)
 * ```
 */

// ─── Plugin ─────────────────────────────────────────────────────────────────
export { createChat, useChat } from "./composables/useChat";
export type { ChatPluginOptions } from "./composables/useChat";

// ─── Components ─────────────────────────────────────────────────────────────
export { default as ChatRoot } from "./components/ChatRoot.vue";
export { default as ChatMessages } from "./components/ChatMessages.vue";
export { default as ChatInput } from "./components/ChatInput.vue";
export { default as ChatBubble } from "./components/ChatBubble.vue";
export { default as ChatPageBar } from "./components/ChatPageBar.vue";
export { default as ChatList } from "./components/ChatList.vue";
export { default as ChatProfileOverview } from "./components/ChatProfileOverview.vue";
export { default as ContactAvatar } from "./components/contact/ContactAvatar.vue";
export { default as ChatContactDisplay } from "./components/contact/ChatContactDisplay.vue";

// ─── Sub-components (chat-bubbles) ──────────────────────────────────────────
export { default as ImageGroupDisplay } from "./components/chat-bubbles/ImageGroupDisplay.vue";
export { default as BubbleVideo } from "./components/chat-bubbles/BubbleVideo.vue";
export { default as VoiceDisplay } from "./components/chat-bubbles/VoiceDisplay.vue";
export { default as FileDisplay } from "./components/chat-bubbles/FileDisplay.vue";
export { default as BubbleOptions } from "./components/chat-bubbles/BubbleOptions.vue";
export { default as RequestCard } from "./components/chat-bubbles/RequestCard.vue";
export { default as RequestDisplay } from "./components/chat-bubbles/RequestDisplay.vue";

// ─── Sub-components (chat-input) ────────────────────────────────────────────
export { default as InputAttachment } from "./components/chat-input/InputAttachment.vue";
export { default as VideoRecordDisplay } from "./components/chat-input/VideoRecordDisplay.vue";
export { default as AttachmentFileDisplay } from "./components/chat-input/AttachmentFileDisplay.vue";
export { default as PermissionPopup } from "./components/chat-input/PermissionPopup.vue";

// ─── Sub-components (medic-features) ────────────────────────────────────────
export { default as MedicSelector } from "./components/medic-features/MedicSelector.vue";
export { default as PrescriptionDisplay } from "./components/medic-features/PrescriptionDisplay.vue";

// ─── Sub-components (profile) ───────────────────────────────────────────────
export { default as ProfileFileDisplay } from "./components/profile/FileDisplay.vue";

// ─── Stores ─────────────────────────────────────────────────────────────────
export { useChatStore } from "./stores/chatStore";
export { useChatActionStore } from "./stores/chatActionStore";

// ─── Composables ────────────────────────────────────────────────────────────
export { useChatRecording } from "./composables/useChatRecording";
export { useChatTheme } from "./composables/useChatTheme";

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
  Message,
  MessageType,
  MessageStatus,
  Contact,
  ExtendedMessage,
  FilterKeys,
  ChatFilter,
  Request,
  AccessRequest,
  ServiceRequest,
  ServiceProvider,
} from "./types/chat";

export type { ChatDataAdapter } from "./types/adapter";
export type { ChatTheme } from "./types/theme";
export { defaultTheme } from "./types/theme";
export type { ChatTextField } from "./types/chat-input";

// ─── Utilities ──────────────────────────────────────────────────────────────
export {
  formatBytes,
  formatCurrency,
  formatDuration,
  formatCountdown,
  formatDateShort,
  formatTime,
  formatRelativeDate,
  formatPhoneNumber,
  replaceDigitsByLocale,
  getYearsPassed,
} from "./utils/formatters";

export {
  checkPermission,
  requestPermission,
  checkAllPermissions,
  hasDevice,
  hasMultipleCameras,
} from "./utils/permissions";

// ─── Mock (for testing) ─────────────────────────────────────────────────────
export { createMockAdapter } from "./utils/mockAdapter";
