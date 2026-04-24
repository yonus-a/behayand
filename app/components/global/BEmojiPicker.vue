<template>
  <ClientOnly>
    <div class="b-emoji-picker" @click.stop>
      <emoji-picker 
        ref="picker" 
        :class="theme"
        @emoji-click="$emit('select', $event.detail.unicode)"
      ></emoji-picker>
    </div>
    
    <template #fallback>
      <div class="w-[350px] h-[400px] bg-surface animate-pulse rounded-2xl border border-outline-variant" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
// No more dynamic imports or onMounted boilerplate here!
defineProps({
  theme: { type: String, default: 'light' }
});

defineEmits(['select']);
</script>

<style scoped>
/* Full CSS control remains here */
emoji-picker {
  width: 100%;
  max-width: 350px;
  height: 400px;
  border: 1px solid var(--outline-variant);
  border-radius: 16px;
  background-color: var(--surface);
  --background: var(--surface);
  --font-family: "IranYekan", "AppleColorEmoji", sans-serif;
  box-shadow: var(--shadow-floating);
}

/* Customizing the Search and Tabs */
emoji-picker::part(search) {
  background: var(--surface-variant);
  border: 1px solid var(--outline-variant);
  border-radius: 8px;
}
</style>