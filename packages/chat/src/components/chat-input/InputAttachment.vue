<script setup lang="ts">
/**
 * Attachment selector panel for chat input.
 * Allows selecting files, images, and triggering camera/audio.
 */
defineProps<{
  visible: boolean
  allowedTypes?: string[]
}>()

defineEmits<{
  (e: 'select-file'): void
  (e: 'select-image'): void
  (e: 'select-camera'): void
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="slide-up">
    <div v-if="visible" class="chat-input-attachment">
      <slot>
        <div class="attachment-grid">
          <button class="attachment-btn" @click="$emit('select-image')">
            <slot name="image-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </slot>
            <span class="attachment-label">
              <slot name="image-label">Image</slot>
            </span>
          </button>

          <button class="attachment-btn" @click="$emit('select-file')">
            <slot name="file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </slot>
            <span class="attachment-label">
              <slot name="file-label">File</slot>
            </span>
          </button>

          <button class="attachment-btn" @click="$emit('select-camera')">
            <slot name="camera-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              </svg>
            </slot>
            <span class="attachment-label">
              <slot name="camera-label">Camera</slot>
            </span>
          </button>
        </div>
      </slot>
    </div>
  </Transition>
</template>

<style scoped>
.chat-input-attachment {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--chat-surface, #fff);
  border-top: 1px solid var(--chat-outline-variant, #e0e0e0);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}
.attachment-grid {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.attachment-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: var(--chat-surface-variant, #f5f5f5);
  border-radius: 12px;
  cursor: pointer;
  color: var(--chat-primary, #3b82f6);
  transition: background 0.15s;
}
.attachment-btn:hover {
  background: var(--chat-surface-variant2, #eee);
}
.attachment-label {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(8px);
  opacity: 0;
}
</style>
