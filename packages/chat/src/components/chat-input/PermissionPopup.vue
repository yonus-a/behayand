<script setup lang="ts">
/**
 * Permission popup for requesting microphone/camera access.
 * Shows when the user tries to record but permissions aren't granted.
 */
defineProps<{
  visible: boolean
  permissionType: 'microphone' | 'camera' | 'both'
}>()

defineEmits<{
  (e: 'request'): void
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="permission-popup-overlay" @click.self="$emit('close')">
      <div class="permission-popup">
        <slot :permission-type="permissionType">
          <div class="permission-icon">
            <slot name="icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="perm-svg">
                <path v-if="permissionType === 'microphone'" d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                <path v-else d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </slot>
          </div>

          <h3 class="permission-title">
            <slot name="title">
              {{ permissionType === 'microphone' ? 'Microphone Access' : 'Camera Access' }}
            </slot>
          </h3>

          <p class="permission-desc">
            <slot name="description">
              Please grant {{ permissionType }} permission to use this feature.
            </slot>
          </p>

          <div class="permission-actions">
            <button class="btn-cancel" @click="$emit('close')">
              <slot name="cancel-text">Cancel</slot>
            </button>
            <button class="btn-request" @click="$emit('request')">
              <slot name="request-text">Grant Access</slot>
            </button>
          </div>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.permission-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.permission-popup {
  background: var(--chat-surface, #fff);
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 90%;
  text-align: center;
}
.permission-icon {
  margin-bottom: 16px;
}
.perm-svg {
  color: var(--chat-primary, #3b82f6);
}
.permission-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--chat-on-surface, #333);
}
.permission-desc {
  font-size: 13px;
  color: var(--chat-on-surface-secondary, #666);
  margin: 0 0 20px;
  line-height: 1.4;
}
.permission-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.btn-cancel, .btn-request {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}
.btn-cancel {
  background: var(--chat-surface-variant, #f5f5f5);
  color: var(--chat-on-surface, #333);
}
.btn-request {
  background: var(--chat-primary, #3b82f6);
  color: white;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
