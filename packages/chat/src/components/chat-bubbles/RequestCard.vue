<script setup lang="ts">
/**
 * Displays a service/access request card in a message bubble.
 */
import type { Request } from '../../types/chat'

defineProps<{
  request: Request
  isMine: boolean
}>()

defineEmits<{
  (e: 'accept', request: Request): void
  (e: 'reject', request: Request): void
  (e: 'view', request: Request): void
}>()
</script>

<template>
  <div class="chat-request-card" :class="{ 'is-mine': isMine }">
    <slot :request="request">
      <div class="request-header">
        <slot name="icon">
          <span class="request-icon">📋</span>
        </slot>
        <span class="request-type">{{ request.type === 'personal-info' ? 'Access Request' : 'Service Request' }}</span>
      </div>

      <div v-if="request.type === 'add-person'" class="request-body">
        <p v-if="(request.request as any).serviceLabel" class="request-service">
          {{ (request.request as any).serviceLabel }}
        </p>
        <p v-if="(request.request as any).providers?.length" class="request-providers">
          {{ (request.request as any).providers.length }} provider(s)
        </p>
      </div>

      <div class="request-status" :class="`status-${request.request.status}`">
        {{ request.request.status }}
      </div>

      <div v-if="request.request.status === 'pending' && !isMine" class="request-actions">
        <button class="btn-accept" @click="$emit('accept', request)">
          <slot name="accept-text">Accept</slot>
        </button>
        <button class="btn-reject" @click="$emit('reject', request)">
          <slot name="reject-text">Reject</slot>
        </button>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.chat-request-card {
  padding: 12px;
  border-radius: 8px;
  background: var(--chat-surface-variant, #f5f5f5);
  min-width: 220px;
}
.request-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.request-type {
  font-weight: 600;
  font-size: 13px;
  color: var(--chat-on-surface, #333);
}
.request-body {
  margin-bottom: 8px;
}
.request-service {
  font-size: 12px;
  color: var(--chat-on-surface, #333);
  margin: 0;
}
.request-providers {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
  margin: 4px 0 0;
}
.request-status {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}
.status-pending { background: #fef3c7; color: #92400e; }
.status-accepted { background: #d1fae5; color: #065f46; }
.status-rejected { background: #fee2e2; color: #991b1b; }
.request-actions {
  display: flex;
  gap: 8px;
}
.btn-accept, .btn-reject {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}
.btn-accept {
  background: var(--chat-primary, #3b82f6);
  color: white;
}
.btn-reject {
  background: var(--chat-surface-variant2, #e5e5e5);
  color: var(--chat-on-surface, #333);
}
</style>
