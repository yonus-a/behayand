// Main component
export { default as BehayandChat } from "./components/BehayandChat.vue";

// Sub-components (for custom layouts)
export { default as ChatContactList } from "./components/ChatContactList.vue";
export { default as ChatContactItem } from "./components/ChatContactItem.vue";
export { default as ChatMessages } from "./components/ChatMessages.vue";
export { default as ChatBubble } from "./components/ChatBubble.vue";
export { default as ChatInput } from "./components/ChatInput.vue";
export { default as ChatHeader } from "./components/ChatHeader.vue";

// Types
export type {
  Message,
  MessageType,
  Contact,
  FilterKeys,
  ChatFilter,
  ExtendedMessage,
  ChatRequest,
  AccessRequest,
  ServiceRequest,
  RequestProvider,
  RequestStatus,
  CurrentUser,
  PaginatedContacts,
  PaginatedMessages,
  MenuOption,
  ChatConfig,
} from "./types";

// Adapter
export type { ChatDataAdapter } from "./adapter/types";
export { ChatAdapterKey, provideChatAdapter, useChatAdapter } from "./adapter/useChatAdapter";
export { MockChatAdapter } from "./adapter/MockChatAdapter";

// Stores (for advanced usage)
export { useChatStore } from "./stores/chatStore";
export { useChatActionStore } from "./stores/chatActionStore";

// Composables
export { useDate } from "./composables/useDate";
export { useWindowSize } from "./composables/useWindowSize";

// i18n
export { createTranslationFn, TranslationsKey } from "./i18n";
export type { TranslationFn } from "./i18n";

// Styles - consumers should import '@behayand/chat/style.css'
import "./styles/main.css";
