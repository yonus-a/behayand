<script setup lang="ts">
import { formatBytes } from '../../utils/formatters'

/**
 * Displays a file attachment in a message bubble.
 */
defineProps<{
  fileName: string
  fileSize?: number
  fileUrl: string
  isMine: boolean
}>()

defineEmits<{
  (e: 'download'): void
}>()
</script>

<template>
  <div class="chat-file-display" :class="{ 'is-mine': isMine }">
    <slot name="icon">
      <div class="file-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
        </svg>
      </div>
    </slot>

    <div class="file-info">
      <span class="file-name">{{ fileName }}</span>
      <span v-if="fileSize" class="file-size">{{ formatBytes(fileSize) }}</span>
    </div>

    <button class="download-btn" @click="$emit('download')">
      <slot name="download-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      </slot>
    </button>
  </div>
</template>

<style scoped>
.chat-file-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--chat-surface-variant, #f5f5f5);
  min-width: 200px;
}
.file-icon {
  color: var(--chat-primary, #3b82f6);
}
.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.file-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--chat-on-surface, #333);
}
.file-size {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
}
.download-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--chat-primary, #3b82f6);
  padding: 4px;
}
</style>
