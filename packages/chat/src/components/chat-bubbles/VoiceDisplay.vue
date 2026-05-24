<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDuration } from '../../utils/formatters'

/**
 * Displays an audio/voice message with playback controls.
 */
const props = defineProps<{
  src: string
  duration?: number
  isMine: boolean
}>()

defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
}>()

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const progress = computed(() =>
  props.duration ? (currentTime.value / props.duration) * 100 : 0
)

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function onTimeUpdate() {
  if (audio.value) {
    currentTime.value = audio.value.currentTime
  }
}

function onEnded() {
  isPlaying.value = false
  currentTime.value = 0
}
</script>

<template>
  <div class="chat-voice-display" :class="{ 'is-mine': isMine }">
    <audio
      ref="audio"
      :src="src"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
    />

    <button class="play-btn" @click="togglePlay">
      <slot name="play-icon" :is-playing="isPlaying">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path v-if="!isPlaying" d="M8 5v14l11-7z"/>
          <path v-else d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </slot>
    </button>

    <div class="voice-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }" />
      </div>
      <span class="voice-time">
        {{ formatDuration(isPlaying ? currentTime : (duration || 0)) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.chat-voice-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  min-width: 200px;
}
.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--chat-on-surface, #333);
  padding: 4px;
}
.voice-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.progress-bar {
  height: 4px;
  background: var(--chat-outline-variant, #e0e0e0);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--chat-primary, #3b82f6);
  transition: width 0.1s linear;
}
.voice-time {
  font-size: 11px;
  color: var(--chat-on-surface-secondary, #666);
}
</style>
