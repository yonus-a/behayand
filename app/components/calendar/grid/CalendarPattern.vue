<template>
  <svg 
    width="100%" 
    height="120%" 
    viewBox="0 0 440 221" 
    preserveAspectRatio="xMidYMid slice" 
    class=" text-surface-variant"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      v-for="n in 25" 
      :key="n"
      :x="getX(n)" 
      y="220.895" 
      width="300" 
      height="12" 
      :transform="`rotate(-115 ${getX(n)} 220.895)`" 
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CalendarPattern',
    setup() {
        // Start further left and use more lines to ensure full coverage
        const getX = (n: number) => -50 + (n - 1) * 25;

        return { getX }
    }
})
</script>