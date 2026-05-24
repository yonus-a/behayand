<script setup lang="ts">
import { ref } from 'vue'

/**
 * Video recording display for chat input.
 * Shows preview of recording and controls.
 */
defineProps<{
  recording: boolean
  duration: number
  previewUrl?: string
}>()

defineEmits<{
  (e: 'stop'): void
  (e: 'cancel'): void
  (e: 'send'): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
</script>

<template>
  <div class="chat-video-record">
    <slot :recording="recording" :duration="duration">
      <div class="video-preview">
        <video
          v-if="previewUrl"
          ref="videoRef"
          :src="previewUrl"
          class="preview-video"
          muted
          autoplay
          playsinline
        />
        <div v-else class="recording-indicator">
          <span class="rec-dot" :class="{ active: recording }" />
          <span class="rec-time">
            {{ Math.floor(duration / 60) }}:{{ String(Math.floor(duration % 60)).padStart(2, '0') }}
          </span>
        </div>
      </div>

      <div class="video-controls">
        <button class="control-btn cancel" @click="$emit('cancel')">
          <slot name="cancel-icon">✕</slot>
        </button>
        <button v-if="recording" class="control-btn stop" @click="$emit('stop')">
          <slot name="stop-icon">⏹</slot>
        </button>
        <button v-else class="control-btn send" @click="$emit('send')">
          <slot name="send-icon">➤</slot>
        </button>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.chat-video-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: var(--chat-surface-variant, #f5f5f5);
  border-radius: 12px;
}
.video-preview {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 4/3;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}
.rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #666;
}
.rec-dot.active {
  background: #ef4444;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.rec-time {
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.video-controls {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.control-btn.cancel {
  background: var(--chat-surface-variant2, #e0e0e0);
  color: var(--chat-on-surface, #333);
}
.control-btn.stop {
  background: var(--chat-error, #ef4444);
  color: white;
}
.control-btn.send {
  background: var(--chat-primary, #3b82f6);
  color: white;
}
</style>
