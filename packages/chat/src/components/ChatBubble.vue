<script setup lang="ts">
import { computed } from "vue";
import { useChat } from "../composables/useChat";
import type { ExtendedMessage } from "../types/chat";
import { formatTime } from "../utils/formatters";

const props = defineProps<{
  /** The message to render */
  message: ExtendedMessage;
  /** Whether this message is from the current user */
  isMine?: boolean;
  /** Whether to show the avatar */
  showAvatar?: boolean;
  /** Whether to show the time */
  showTime?: boolean;
  /** Whether this bubble is selected */
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  (e: "click", message: ExtendedMessage): void;
  (e: "long-press", message: ExtendedMessage): void;
  (e: "reply", message: ExtendedMessage): void;
  (e: "select", message: ExtendedMessage): void;
}>();

const { userId, locale } = useChat();

const isMine = computed(
  () => props.isMine ?? props.message.senderId === userId,
);

const showTime = computed(() => props.showTime ?? true);

const showAvatar = computed(() => {
  if (props.showAvatar !== undefined) return props.showAvatar;
  // Show avatar if sender changes from previous message
  if (!props.message.prevMessage) return true;
  return props.message.prevMessage.senderId !== props.message.senderId;
});

const bubbleClass = computed(() => ({
  "chat-bubble": true,
  "chat-bubble--mine": isMine.value,
  "chat-bubble--theirs": !isMine.value,
  "chat-bubble--selected": props.isSelected,
  "chat-bubble--first": !props.message.prevMessage || props.message.prevMessage.senderId !== props.message.senderId,
  "chat-bubble--last": !props.message.nextMessage || props.message.nextMessage.senderId !== props.message.senderId,
}));

// Long press handling
let pressTimeout: ReturnType<typeof setTimeout> | null = null;

const onPointerDown = () => {
  pressTimeout = setTimeout(() => {
    emit("long-press", props.message);
  }, 500);
};

const onPointerUp = () => {
  if (pressTimeout) {
    clearTimeout(pressTimeout);
    pressTimeout = null;
  }
};

const handleClick = () => {
  emit("click", props.message);
};
</script>

<template>
  <div
    :class="bubbleClass"
    @click="handleClick"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Avatar slot -->
    <div v-if="showAvatar && !isMine" class="chat-bubble__avatar">
      <slot name="avatar" :contact="message.contact">
        <div class="chat-bubble__avatar-placeholder">
          {{ message.contact?.name?.charAt(0) || '?' }}
        </div>
      </slot>
    </div>

    <!-- Bubble content -->
    <div class="chat-bubble__content">
      <!-- Reply reference -->
      <div v-if="message.repliedTo" class="chat-bubble__reply">
        <slot name="reply" :replied-to="message.repliedTo">
          <div class="chat-bubble__reply-text">
            {{ message.repliedTo.text || '[Attachment]' }}
          </div>
        </slot>
      </div>

      <!-- Message body -->
      <div class="chat-bubble__body">
        <slot :message="message" :is-mine="isMine">
          <!-- Text -->
          <p v-if="message.text" class="chat-bubble__text">{{ message.text }}</p>

          <!-- Images -->
          <div v-if="message.imageUrl?.length" class="chat-bubble__images">
            <slot name="images" :urls="message.imageUrl">
              <img
                v-for="(url, i) in message.imageUrl"
                :key="i"
                :src="url"
                class="chat-bubble__image"
                loading="lazy"
              />
            </slot>
          </div>

          <!-- File -->
          <div v-if="message.fileUrl" class="chat-bubble__file">
            <slot name="file" :url="message.fileUrl">
              <a :href="message.fileUrl" target="_blank" class="chat-bubble__file-link">
                📎 File
              </a>
            </slot>
          </div>

          <!-- Voice -->
          <div v-if="message.voiceUrl" class="chat-bubble__voice">
            <slot name="voice" :url="message.voiceUrl">
              <audio :src="message.voiceUrl" controls class="chat-bubble__audio" />
            </slot>
          </div>

          <!-- Video -->
          <div v-if="message.videoUrl" class="chat-bubble__video">
            <slot name="video" :url="message.videoUrl">
              <video :src="message.videoUrl" controls class="chat-bubble__video-player" />
            </slot>
          </div>

          <!-- Request -->
          <div v-if="message.request" class="chat-bubble__request">
            <slot name="request" :request="message.request" />
          </div>
        </slot>
      </div>

      <!-- Footer (time + status) -->
      <div v-if="showTime" class="chat-bubble__footer">
        <span v-if="message.isEdited" class="chat-bubble__edited">edited</span>
        <span class="chat-bubble__time">
          {{ formatTime(message.date, locale) }}
        </span>
        <span v-if="isMine" class="chat-bubble__status">
          <slot name="status" :message="message">
            <span v-if="!message.isSent" class="chat-bubble__status-pending">⏳</span>
            <span v-else-if="message.isRead" class="chat-bubble__status-read">✓✓</span>
            <span v-else class="chat-bubble__status-sent">✓</span>
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.chat-bubble {
  display: flex;
  gap: 8px;
  padding: 2px 0;
  max-width: 80%;
}

.chat-bubble--mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-bubble--theirs {
  align-self: flex-start;
}

.chat-bubble--selected {
  background-color: color-mix(in srgb, var(--chat-primary) 10%, transparent);
  border-radius: 12px;
}

.chat-bubble__avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-self: flex-end;
}

.chat-bubble__avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--chat-surface-variant-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--chat-on-surface-secondary);
}

.chat-bubble__content {
  padding: 8px 12px;
  border-radius: 16px;
  min-width: 60px;
}

.chat-bubble--mine .chat-bubble__content {
  background-color: var(--chat-bubble-mine);
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-bubble--theirs .chat-bubble__content {
  background-color: var(--chat-bubble-theirs);
  color: var(--chat-on-surface);
  border-bottom-left-radius: 4px;
}

.chat-bubble--mine.chat-bubble--first .chat-bubble__content {
  border-top-right-radius: 16px;
}

.chat-bubble--mine.chat-bubble--last .chat-bubble__content {
  border-bottom-right-radius: 4px;
}

.chat-bubble__reply {
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-inline-start: 2px solid var(--chat-primary);
}

.chat-bubble__reply-text {
  font-size: 0.75rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.chat-bubble__text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
}

.chat-bubble__images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 4px;
  margin: 4px 0;
}

.chat-bubble__image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  max-height: 200px;
  cursor: pointer;
}

.chat-bubble__file-link {
  color: inherit;
  text-decoration: underline;
  font-size: 0.85rem;
}

.chat-bubble__audio {
  max-width: 250px;
  height: 32px;
}

.chat-bubble__video-player {
  max-width: 280px;
  border-radius: 8px;
}

.chat-bubble__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
}

.chat-bubble__time {
  font-size: 0.65rem;
  opacity: 0.7;
}

.chat-bubble__edited {
  font-size: 0.6rem;
  opacity: 0.6;
  font-style: italic;
}

.chat-bubble__status {
  font-size: 0.7rem;
}

.chat-bubble__status-pending {
  opacity: 0.5;
}

.chat-bubble__status-read {
  color: var(--chat-success);
}
</style>
