<script setup lang="ts">
import { computed } from "vue";
import { useChat } from "../composables/useChat";
import type { Contact } from "../types/chat";
import { formatRelativeDate, getYearsPassed, formatPhoneNumber } from "../utils/formatters";

const props = defineProps<{
  /** The contact to show profile for */
  contact: Contact;
  /** Whether to show medical actions (refer, prescribe) */
  showMedicalActions?: boolean;
  /** Whether to show call buttons */
  showCallButtons?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "call", type: "voice" | "video"): void;
  (e: "refer"): void;
  (e: "end-conversation"): void;
  (e: "action", action: string): void;
}>();

const { t, locale } = useChat();

const age = computed(() => {
  if (!props.contact.birthDate) return null;
  return getYearsPassed(props.contact.birthDate);
});

const lastSeenText = computed(() => {
  if (props.contact.isOnline) return t("chat.online");
  return formatRelativeDate(props.contact.lastSeen, locale);
});

const phoneFormatted = computed(() => {
  if (!props.contact.phoneNumber) return null;
  return formatPhoneNumber(props.contact.phoneNumber);
});
</script>

<template>
  <div class="chat-profile">
    <!-- Header with close button -->
    <div class="chat-profile__header">
      <button class="chat-profile__close" @click="$emit('close')">
        <slot name="close-icon">✕</slot>
      </button>
    </div>

    <!-- Avatar -->
    <div class="chat-profile__avatar-section">
      <slot name="avatar" :contact="contact">
        <div class="chat-profile__avatar">
          <img
            v-if="contact.imageUrl"
            :src="contact.imageUrl"
            :alt="contact.name"
            class="chat-profile__avatar-img"
          />
          <span v-else class="chat-profile__avatar-initials">
            {{ contact.name?.charAt(0) }}{{ contact.lastName?.charAt(0) }}
          </span>
        </div>
      </slot>
      <h3 class="chat-profile__name">
        {{ contact.name }} {{ contact.lastName }}
      </h3>
      <span class="chat-profile__status" :class="{ 'chat-profile__status--online': contact.isOnline }">
        {{ lastSeenText }}
      </span>
    </div>

    <!-- Action buttons -->
    <div class="chat-profile__actions">
      <slot name="actions" :contact="contact">
        <button
          v-if="showCallButtons !== false"
          class="chat-profile__action-btn"
          @click="$emit('call', 'voice')"
          :disabled="!contact.isActive"
        >
          <span>📞</span>
          <span>{{ t('chat.voiceCall') }}</span>
        </button>
        <button
          v-if="showCallButtons !== false"
          class="chat-profile__action-btn"
          @click="$emit('call', 'video')"
          :disabled="!contact.isActive"
        >
          <span>📹</span>
          <span>{{ t('chat.videoCall') }}</span>
        </button>
        <button
          v-if="showMedicalActions"
          class="chat-profile__action-btn"
          @click="$emit('refer')"
        >
          <span>📋</span>
          <span>{{ t('chat.refer') }}</span>
        </button>
        <button
          class="chat-profile__action-btn chat-profile__action-btn--danger"
          @click="$emit('end-conversation')"
        >
          <span>🚫</span>
          <span>{{ t('chat.endConversation') }}</span>
        </button>
      </slot>
    </div>

    <!-- Info section -->
    <div class="chat-profile__info">
      <slot name="info" :contact="contact">
        <div v-if="phoneFormatted" class="chat-profile__info-item">
          <span class="chat-profile__info-label">{{ t('chat.phone') }}</span>
          <span class="chat-profile__info-value" dir="ltr">{{ phoneFormatted }}</span>
        </div>
        <div v-if="contact.nationalCode" class="chat-profile__info-item">
          <span class="chat-profile__info-label">{{ t('chat.nationalCode') }}</span>
          <span class="chat-profile__info-value">{{ contact.nationalCode }}</span>
        </div>
        <div v-if="age !== null" class="chat-profile__info-item">
          <span class="chat-profile__info-label">{{ t('chat.age') }}</span>
          <span class="chat-profile__info-value">{{ age }}</span>
        </div>
      </slot>
    </div>

    <!-- Additional content (media, files, etc.) -->
    <div class="chat-profile__content">
      <slot name="content" :contact="contact" />
    </div>
  </div>
</template>

<style>
.chat-profile {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background-color: var(--chat-surface);
  border-inline-start: 1px solid var(--chat-outline-variant);
}

.chat-profile__header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}

.chat-profile__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--chat-on-surface-secondary);
  font-size: 1.2rem;
}

.chat-profile__close:hover {
  background-color: var(--chat-surface-variant);
}

.chat-profile__avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px 24px;
}

.chat-profile__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
}

.chat-profile__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-profile__avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--chat-surface-variant-2);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--chat-on-surface-secondary);
}

.chat-profile__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--chat-on-surface);
}

.chat-profile__status {
  font-size: 0.8rem;
  color: var(--chat-on-surface-secondary);
  margin-top: 4px;
}

.chat-profile__status--online {
  color: var(--chat-success);
}

.chat-profile__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--chat-outline-variant);
}

.chat-profile__action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 12px;
  color: var(--chat-on-surface-secondary);
  font-size: 0.7rem;
  transition: background-color 0.2s;
}

.chat-profile__action-btn:hover {
  background-color: var(--chat-surface-variant);
}

.chat-profile__action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.chat-profile__action-btn--danger {
  color: var(--chat-error);
}

.chat-profile__info {
  padding: 16px;
}

.chat-profile__info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--chat-outline-variant);
}

.chat-profile__info-label {
  font-size: 0.8rem;
  color: var(--chat-on-surface-secondary);
}

.chat-profile__info-value {
  font-size: 0.85rem;
  color: var(--chat-on-surface);
  font-weight: 500;
}

.chat-profile__content {
  flex: 1;
  padding: 16px;
}
</style>
