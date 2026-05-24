<script setup lang="ts">
/**
 * Displays a group of images in a message bubble.
 * Supports lightbox viewing via slot.
 */
defineProps<{
  images: string[]
  isMine: boolean
}>()

defineEmits<{
  (e: 'view', index: number): void
}>()
</script>

<template>
  <div class="chat-image-group" :class="{ 'is-mine': isMine }">
    <div
      class="chat-image-grid"
      :class="`grid-${Math.min(images.length, 4)}`"
    >
      <div
        v-for="(img, index) in images"
        :key="index"
        class="chat-image-item"
        @click="$emit('view', index)"
      >
        <slot name="image" :src="img" :index="index">
          <img :src="img" alt="" loading="lazy" />
        </slot>
      </div>
    </div>
    <slot name="overlay" />
  </div>
</template>

<style scoped>
.chat-image-group {
  border-radius: 8px;
  overflow: hidden;
}
.chat-image-grid {
  display: grid;
  gap: 2px;
}
.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1fr 1fr; }
.grid-4 { grid-template-columns: 1fr 1fr; }
.chat-image-item {
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 1;
}
.chat-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
