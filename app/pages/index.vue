<script setup lang="ts">
import { ref } from 'vue'

const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Global Toggles for testing all button states
const isLoading = ref(false)
const isDisabled = ref(false)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 bg-surface text-on-surface flex flex-col items-center py-12 gap-8">
    
    <div class="p-6 rounded-2xl border border-outline bg-surface-variant shadow-lg flex flex-col items-center gap-6 w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-primary">Button System Testing</h1>
      
      <div class="flex gap-4 items-center">
        <button 
          @click="toggleColorMode"
          class="px-4 py-2 rounded-lg bg-surface text-on-surface border border-outline hover:bg-surface-variant-2"
        >
          Theme: <span class="font-bold uppercase">{{ colorMode.value }}</span>
        </button>

        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" v-model="isLoading" class="w-5 h-5 accent-primary" />
          <span class="font-medium">Toggle Loading State</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" v-model="isDisabled" class="w-5 h-5 accent-primary" />
          <span class="font-medium">Toggle Disabled State</span>
        </label>
      </div>
    </div>

    <div class="w-full max-w-4xl flex flex-col gap-12 px-6">
      
      <section class="flex flex-col gap-4">
        <h2 class="text-xl font-bold text-secondary border-b border-outline pb-2">Sizes (Fill Primary)</h2>
        <div class="flex items-end gap-4 flex-wrap">
          <BButton text="Extra Small" size="xs" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Small" size="sm" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Medium" size="md" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Large" size="lg" :loading="isLoading" :disabled="isDisabled" />
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="text-xl font-bold text-secondary border-b border-outline pb-2">Styles & Colors (Medium)</h2>
        
        <div class="flex items-center gap-4 flex-wrap">
          <span class="w-24 text-sm font-bold text-neutral-500">Primary:</span>
          <BButton text="Fill" type="fill" color="primary" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Outline" type="outline" color="primary" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Ghost" type="ghost" color="primary" :loading="isLoading" :disabled="isDisabled" />
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <span class="w-24 text-sm font-bold text-neutral-500">Secondary:</span>
          <BButton text="Fill" type="fill" color="secondary" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Outline" type="outline" color="secondary" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Ghost" type="ghost" color="secondary" :loading="isLoading" :disabled="isDisabled" />
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <span class="w-24 text-sm font-bold text-neutral-500">Error:</span>
          <BButton text="Fill" type="fill" color="error" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Outline" type="outline" color="error" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Ghost" type="ghost" color="error" :loading="isLoading" :disabled="isDisabled" />
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="text-xl font-bold text-secondary border-b border-outline pb-2">Icon Placements</h2>
        <div class="flex items-end gap-4 flex-wrap">
          <BButton text="Left Icon" left-icon="PhUser" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Right Icon" right-icon="PhArrowRight" :loading="isLoading" :disabled="isDisabled" />
          <BButton text="Both Icons" left-icon="PhUser" right-icon="PhCaretDown" :loading="isLoading" :disabled="isDisabled" />
          <BButton icon="PhHeart" :loading="isLoading" :disabled="isDisabled" />
          <BButton icon="PhMagnifyingGlass" size="sm" :loading="isLoading" :disabled="isDisabled" />
          <BButton icon="PhPlus" size="lg" color="secondary" :loading="isLoading" :disabled="isDisabled" />
        </div>
      </section>

    </div>
  </div>
</template>