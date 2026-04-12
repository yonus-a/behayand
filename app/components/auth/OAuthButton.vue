<template>
  <div 
    @click="$emit('click', provider)"
    class="h-11 transition-all duration-200 ease-in-out hover:bg-surface-variant-3 w-full cursor-pointer select-none text-label-md text-on-surface bg-surface-variant-2 rounded-xl flex items-center justify-between p-3"
  >
    <div class="w-5 h-5">
      <BImage noLoading
        class="min-w-full min-h-full max-w-full max-h-full w-full h-full" 
        :src="src" 
      />
    </div>
    
    <div>{{ text }}</div>
    
    <div class="w-5"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  text: string;
  provider: 'google' | 'dolat' | string;
}>();

defineEmits(['click']);
</script>