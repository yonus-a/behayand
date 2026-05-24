<script setup lang="ts">
/**
 * Displays a video message bubble with play controls.
 */
defineProps<{
  src: string
  thumbnail?: string
  duration?: number
  isMine: boolean
}>()

defineEmits<{
  (e: 'play'): void
}>()
</script>

<template>
  <div class="chat-bubble-video" :class="{ 'is-mine': isMine }">
    <slot name="player" :src="src">
      <div class="video-container" @click="$emit('play')">
        <img v-if="thumbnail" :src="thumbnail" alt="" class="video-thumbnail" />
        <div class="play-overlay">
          <slot name="play-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </slot>
        </div>
        <span v-if="duration" class="video-duration">
          {{ Math.floor(duration / 60) }}:{{ String(duration % 60).padStart(2, '0') }}
        </span>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.chat-bubble-video {
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}
.video-container {
  position: relative;
  cursor: pointer;
}
.video-thumbnail {
  width: 100%;
  height: auto;
  display: block;
}
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
.video-duration {
  position: absolute;
  bottom: 4px;
  right: 8px;
  color: white;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
