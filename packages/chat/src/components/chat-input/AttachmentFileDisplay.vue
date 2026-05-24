<script setup lang="ts">
import { formatBytes } from '../../utils/formatters'

/**
 * Displays a file that has been selected/attached before sending.
 * Shows file info and allows removing the attachment.
 */
defineProps<{
  fileName: string
  fileSize: number
  fileType?: string
  uploadProgress?: number
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <div class="attachment-file-display">
    <slot :file-name="fileName" :file-size="fileSize" :progress="uploadProgress">
      <div class="file-preview">
        <slot name="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="file-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
          </svg>
        </slot>

        <div class="file-details">
          <span class="file-name">{{ fileName }}</span>
          <span class="file-meta">{{ formatBytes(fileSize) }}</span>
        </div>

        <button class="remove-btn" @click="$emit('remove')">
          <slot name="remove-icon">✕</slot>
        </button>
      </div>

      <div v-if="uploadProgress !== undefined && uploadProgress < 100" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${uploadProgress}%` }" />
        </div>
        <span class="progress-text">{{ uploadProgress }}%</span>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.attachment-file-display {
  padding: 8px 12px;
  background: var(--chat-surface-variant, #f5f5f5);
  border-radius: 8px;
  margin-bottom: 8px;
}
.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}
.file-icon {
  color: var(--chat-primary, #3b82f6);
  flex-shrink: 0;
}
.file-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.file-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--chat-on-surface, #333);
}
.file-meta {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
}
.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--chat-on-surface-secondary, #666);
  padding: 4px;
  font-size: 14px;
}
.remove-btn:hover {
  color: var(--chat-error, #ef4444);
}
.upload-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.progress-bar {
  flex: 1;
  height: 3px;
  background: var(--chat-outline-variant, #e0e0e0);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--chat-primary, #3b82f6);
  transition: width 0.2s ease;
}
.progress-text {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
  min-width: 32px;
}
</style>
