<script setup lang="ts">
/**
 * Displays detailed request information.
 * Used when expanding a request card.
 */
import type { Request } from '../../types/chat'

defineProps<{
  request: Request
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="chat-request-display">
    <slot :request="request">
      <div class="request-display-header">
        <span class="request-display-title">Request Details</span>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="request-display-body">
        <div class="detail-row">
          <span class="label">Type:</span>
          <span class="value">{{ request.type }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span>
          <span class="value" :class="`status-${request.request.status}`">{{ request.request.status }}</span>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.chat-request-display {
  padding: 16px;
  background: var(--chat-surface, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.request-display-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.request-display-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--chat-on-surface, #333);
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--chat-on-surface-secondary, #666);
}
.detail-row {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--chat-outline-variant, #e0e0e0);
}
.label {
  font-size: 12px;
  color: var(--chat-on-surface-secondary, #666);
  min-width: 60px;
}
.value {
  font-size: 12px;
  color: var(--chat-on-surface, #333);
}
.status-pending { color: #92400e; }
.status-accepted { color: #065f46; }
.status-rejected { color: #991b1b; }
</style>
