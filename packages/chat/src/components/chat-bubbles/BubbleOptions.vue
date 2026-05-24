<script setup lang="ts">
/**
 * Displays message selection options (reply, edit, delete, forward).
 * Uses slots so consumers can provide their own icons.
 */
import type { Message } from '../../types/chat'

defineProps<{
  message: Message
  isMine: boolean
  canEdit?: boolean
  canDelete?: boolean
}>()

defineEmits<{
  (e: 'reply', message: Message): void
  (e: 'edit', message: Message): void
  (e: 'delete', message: Message): void
  (e: 'forward', message: Message): void
  (e: 'copy', message: Message): void
}>()
</script>

<template>
  <div class="chat-bubble-options" :class="{ 'is-mine': isMine }">
    <slot :message="message" :is-mine="isMine">
      <button
        class="option-btn"
        @click="$emit('reply', message)"
        title="Reply"
      >
        <slot name="reply-icon">↩</slot>
      </button>

      <button
        v-if="message.type === 'text'"
        class="option-btn"
        @click="$emit('copy', message)"
        title="Copy"
      >
        <slot name="copy-icon">📋</slot>
      </button>

      <button
        v-if="isMine && canEdit && message.type === 'text'"
        class="option-btn"
        @click="$emit('edit', message)"
        title="Edit"
      >
        <slot name="edit-icon">✏️</slot>
      </button>

      <button
        v-if="canDelete"
        class="option-btn option-btn--danger"
        @click="$emit('delete', message)"
        title="Delete"
      >
        <slot name="delete-icon">🗑️</slot>
      </button>

      <button
        class="option-btn"
        @click="$emit('forward', message)"
        title="Forward"
      >
        <slot name="forward-icon">↗</slot>
      </button>
    </slot>
  </div>
</template>

<style scoped>
.chat-bubble-options {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--chat-surface, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.option-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.15s;
}
.option-btn:hover {
  background: var(--chat-surface-variant, #f5f5f5);
}
.option-btn--danger:hover {
  background: var(--chat-error, #ef4444);
  color: white;
}
</style>
