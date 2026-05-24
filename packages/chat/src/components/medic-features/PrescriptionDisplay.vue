<script setup lang="ts">
/**
 * Displays a prescription summary in a message bubble.
 * Fully slot-based so consumers can customize the display.
 */
defineProps<{
  medications: Array<{
    id: number | string
    name: string
    dosage?: string
    frequency?: string
    duration?: string
    quantity?: number
  }>
  isMine: boolean
}>()

defineEmits<{
  (e: 'view-details'): void
}>()
</script>

<template>
  <div class="prescription-display" :class="{ 'is-mine': isMine }">
    <slot :medications="medications">
      <div class="prescription-header">
        <slot name="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
          </svg>
        </slot>
        <span class="prescription-title">
          <slot name="title">Prescription</slot>
        </span>
        <span class="medication-count">{{ medications.length }} item(s)</span>
      </div>

      <div class="medication-list">
        <div
          v-for="med in medications.slice(0, 3)"
          :key="med.id"
          class="medication-item"
        >
          <slot name="medication" :medication="med">
            <span class="med-name">{{ med.name }}</span>
            <span v-if="med.dosage" class="med-dosage">{{ med.dosage }}</span>
          </slot>
        </div>
        <div v-if="medications.length > 3" class="more-items">
          +{{ medications.length - 3 }} more
        </div>
      </div>

      <button class="view-btn" @click="$emit('view-details')">
        <slot name="view-text">View Full Prescription</slot>
      </button>
    </slot>
  </div>
</template>

<style scoped>
.prescription-display {
  padding: 12px;
  background: var(--chat-surface-variant, #f5f5f5);
  border-radius: 8px;
  min-width: 220px;
}
.prescription-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--chat-primary, #3b82f6);
}
.prescription-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--chat-on-surface, #333);
}
.medication-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
}
.medication-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}
.medication-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--chat-surface, #fff);
  border-radius: 4px;
}
.med-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--chat-on-surface, #333);
}
.med-dosage {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
}
.more-items {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
  padding: 4px 8px;
}
.view-btn {
  width: 100%;
  padding: 6px;
  background: var(--chat-primary, #3b82f6);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}
</style>
