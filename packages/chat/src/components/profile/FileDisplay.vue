<script setup lang="ts">
/**
 * File display component for chat profile/sidebar.
 * Shows shared files in a conversation.
 */
defineProps<{
  files: Array<{
    id: number | string
    name: string
    size: number
    type: string
    url: string
    date: Date | string
  }>
  loading?: boolean
}>()

defineEmits<{
  (e: 'download', file: any): void
  (e: 'preview', file: any): void
}>()
</script>

<template>
  <div class="profile-file-display">
    <slot :files="files" :loading="loading">
      <div v-if="loading" class="loading">
        <slot name="loading">Loading files...</slot>
      </div>

      <div v-else-if="files.length === 0" class="empty">
        <slot name="empty">No shared files</slot>
      </div>

      <div v-else class="file-list">
        <div
          v-for="file in files"
          :key="file.id"
          class="file-item"
          @click="$emit('preview', file)"
        >
          <slot name="file" :file="file">
            <div class="file-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-meta">{{ file.type }}</span>
            </div>
            <button class="download-btn" @click.stop="$emit('download', file)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </button>
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.profile-file-display {
  padding: 8px 0;
}
.loading, .empty {
  padding: 24px;
  text-align: center;
  color: var(--chat-on-surface-secondary, #666);
  font-size: 13px;
}
.file-list {
  display: flex;
  flex-direction: column;
}
.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;
}
.file-item:hover {
  background: var(--chat-surface-variant, #f5f5f5);
}
.file-icon {
  color: var(--chat-primary, #3b82f6);
  flex-shrink: 0;
}
.file-info {
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
.download-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--chat-on-surface-secondary, #666);
  padding: 4px;
}
.download-btn:hover {
  color: var(--chat-primary, #3b82f6);
}
</style>
