<script setup lang="ts">
import { computed } from "vue";
import { useChat } from "../composables/useChat";
import { useChatActionStore } from "../stores/chatActionStore";
import type { Contact } from "../types/chat";
import { formatRelativeDate } from "../utils/formatters";

const props = defineProps<{
  /** The contact to display in the page bar */
  contact: Contact;
  /** Whether to show call buttons */
  showCallButton?: boolean;
  /** Whether to show options menu */
  showOptions?: boolean;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "profile-open"): void;
  (e: "call", type: "voice" | "video"): void;
  (e: "action", action: string): void;
  (e: "delete"): void;
  (e: "copy"): void;
}>();

const { t, locale } = useChat();
const actionStore = useChatActionStore();

const isSelectMode = computed(() => actionStore.isSelectMode);
const selectedCount = computed(() => actionStore.selectedMessages.size);

const lastSeenText = computed(() => {
  if (props.contact.isOnline) return t("chat.online");
  return formatRelativeDate(props.contact.lastSeen, locale);
});

const handleDelete = () => {
  actionStore.triggerDelete();
  emit("delete");
};

const handleCopy = () => {
  actionStore.copyMessageText();
  emit("copy");
};
</script>

<template>
  <div class="chat-page-bar">
    <!-- Back button -->
    <button class="chat-page-bar__back" @click="$emit('back')">
      <slot name="back-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </slot>
    </button>

    <!-- Select mode actions -->
    <template v-if="isSelectMode">
      <div class="chat-page-bar__select-info">
        <span>{{ selectedCount }} {{ t('chat.selected') }}</span>
      </div>
      <div class="chat-page-bar__select-actions">
        <button
          v-if="actionStore.canDelete"
          class="chat-page-bar__btn chat-page-bar__btn--danger"
          @click="handleDelete"
        >
          <slot name="delete-icon">🗑</slot>
        </button>
        <button class="chat-page-bar__btn" @click="handleCopy">
          <slot name="copy-icon">📋</slot>
        </button>
        <button class="chat-page-bar__btn" @click="actionStore.clearActions()">
          ✕
        </button>
      </div>
    </template>

    <!-- Normal mode -->
    <template v-else>
      <!-- Contact info -->
      <div class="chat-page-bar__contact" @click="$emit('profile-open')">
        <slot name="avatar" :contact="contact">
          <div class="chat-page-bar__avatar">
            <img
              v-if="contact.imageUrl"
              :src="contact.imageUrl"
              :alt="contact.name"
              class="chat-page-bar__avatar-img"
            />
            <span v-else class="chat-page-bar__avatar-initials">
              {{ contact.name?.charAt(0) }}
            </span>
            <span
              v-if="contact.isOnline"
              class="chat-page-bar__online-dot"
            />
          </div>
        </slot>
        <div class="chat-page-bar__info">
          <span class="chat-page-bar__name">
            {{ contact.name }} {{ contact.lastName }}
          </span>
          <span class="chat-page-bar__status">
            {{ lastSeenText }}
          </span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="chat-page-bar__actions">
        <slot name="actions" :contact="contact">
          <button
            v-if="showCallButton !== false"
            class="chat-page-bar__btn"
            @click="$emit('call', 'voice')"
            :disabled="!contact.isActive"
          >
            <slot name="call-icon">📞</slot>
          </button>
          <button
            v-if="showOptions !== false"
            class="chat-page-bar__btn"
            @click="$emit('action', 'options')"
          >
            <slot name="options-icon">⋮</slot>
          </button>
        </slot>
      </div>
    </template>
  </div>
</template>

<style>
.chat-page-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  border-bottom: 1px solid var(--chat-outline-variant);
  background-color: var(--chat-surface);
  min-height: 56px;
}

.chat-page-bar__back {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--chat-on-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
}

.chat-page-bar__back:hover {
  background-color: var(--chat-surface-variant);
}

.chat-page-bar__contact {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

.chat-page-bar__avatar {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.chat-page-bar__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.chat-page-bar__avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--chat-surface-variant-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--chat-on-surface-secondary);
}

.chat-page-bar__online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--chat-success);
  border: 2px solid var(--chat-surface);
}

.chat-page-bar__info {
  display: flex;
  flex-direction: column;
}

.chat-page-bar__name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--chat-on-surface);
}

.chat-page-bar__status {
  font-size: 0.75rem;
  color: var(--chat-on-surface-secondary);
}

.chat-page-bar__actions {
  display: flex;
  gap: 4px;
}

.chat-page-bar__select-info {
  flex: 1;
  font-weight: 600;
  color: var(--chat-primary);
}

.chat-page-bar__select-actions {
  display: flex;
  gap: 4px;
}

.chat-page-bar__btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--chat-on-surface-secondary);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-page-bar__btn:hover {
  background-color: var(--chat-surface-variant);
}

.chat-page-bar__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.chat-page-bar__btn--danger {
  color: var(--chat-error);
}
</style>
