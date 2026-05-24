<script setup lang="ts">
import { computed } from "vue";
import { useChat } from "../../composables/useChat";
import type { Contact } from "../../types/chat";

const props = defineProps<{
  /** The contact to display */
  contact: Contact;
  /** Whether this contact is currently active/selected */
  isActive?: boolean;
  /** Whether to show skeleton loading state */
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "click", contact: Contact): void;
}>();

const { userId, locale } = useChat();

const lastMessagePreview = computed(() => {
  const msg = props.contact.lastMessage;
  if (!msg) return "";

  if (msg.text) return msg.text;
  if (msg.imageUrl?.length) return "📷 Photo";
  if (msg.voiceUrl) return "🎤 Voice";
  if (msg.videoUrl) return "🎬 Video";
  if (msg.fileUrl) return "📎 File";
  if (msg.request) return "📋 Request";
  return "";
});

const isMinePrefix = computed(() => {
  const msg = props.contact.lastMessage;
  if (!msg) return "";
  return msg.senderId === userId ? "You: " : "";
});

const timeDisplay = computed(() => {
  const msg = props.contact.lastMessage;
  if (!msg) return "";
  return new Date(msg.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>

<template>
  <div
    class="chat-contact-display"
    :class="{
      'chat-contact-display--active': isActive,
      'chat-contact-display--loading': isLoading,
    }"
    @click="$emit('click', contact)"
  >
    <!-- Avatar -->
    <slot name="avatar" :contact="contact">
      <div class="chat-contact-display__avatar">
        <img
          v-if="contact.imageUrl && !isLoading"
          :src="contact.imageUrl"
          :alt="contact.name"
        />
        <span v-else-if="!isLoading">{{ contact.name?.charAt(0) }}</span>
        <div v-else class="chat-contact-display__skeleton-avatar" />
        <span v-if="contact.isOnline && !isLoading" class="chat-contact-display__online" />
      </div>
    </slot>

    <!-- Info -->
    <div class="chat-contact-display__info">
      <div class="chat-contact-display__header">
        <span v-if="!isLoading" class="chat-contact-display__name">
          {{ contact.name }} {{ contact.lastName }}
        </span>
        <div v-else class="chat-contact-display__skeleton-name" />
        <span v-if="!isLoading" class="chat-contact-display__time">
          {{ timeDisplay }}
        </span>
      </div>
      <div class="chat-contact-display__footer">
        <span v-if="!isLoading" class="chat-contact-display__message">
          {{ isMinePrefix }}{{ lastMessagePreview }}
        </span>
        <div v-else class="chat-contact-display__skeleton-message" />
        <span
          v-if="contact.unreadCount && contact.unreadCount > 0 && !isLoading"
          class="chat-contact-display__badge"
        >
          {{ contact.unreadCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.chat-contact-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.chat-contact-display:hover {
  background-color: var(--chat-surface-variant);
}

.chat-contact-display--active {
  background-color: var(--chat-surface-variant-2);
}

.chat-contact-display__avatar {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
}

.chat-contact-display__avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.chat-contact-display__avatar span:first-child:not(.chat-contact-display__online) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--chat-surface-variant-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--chat-on-surface-secondary);
}

.chat-contact-display__online {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--chat-success);
  border: 2px solid var(--chat-surface);
}

.chat-contact-display__info {
  flex: 1;
  min-width: 0;
}

.chat-contact-display__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-contact-display__name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--chat-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-contact-display__time {
  font-size: 0.7rem;
  color: var(--chat-on-surface-secondary);
  flex-shrink: 0;
}

.chat-contact-display__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-contact-display__message {
  font-size: 0.8rem;
  color: var(--chat-on-surface-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-contact-display__badge {
  background-color: var(--chat-primary);
  color: white;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

/* Skeleton */
.chat-contact-display__skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--chat-surface-variant) 25%, var(--chat-surface-variant-2) 50%, var(--chat-surface-variant) 75%);
  background-size: 200% 100%;
  animation: contact-shimmer 1.5s infinite;
}

.chat-contact-display__skeleton-name,
.chat-contact-display__skeleton-message {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--chat-surface-variant) 25%, var(--chat-surface-variant-2) 50%, var(--chat-surface-variant) 75%);
  background-size: 200% 100%;
  animation: contact-shimmer 1.5s infinite;
}

.chat-contact-display__skeleton-name {
  width: 120px;
}

.chat-contact-display__skeleton-message {
  width: 80px;
}

@keyframes contact-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
