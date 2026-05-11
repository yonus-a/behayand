<template>
  <div class="p-10 flex flex-col gap-y-12 bg-surface min-h-screen">

    <BDatePicker />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text1 = ref('');
const text2 = ref('');
const text3 = ref('Disabled value');

const selectedCity = ref();
const selectedCity2 = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
</script>

<style>
/* Optional: Add Phosphor Icons support if using strings for icons.
  Since you mentioned @phosphor-icons/vue in your package.json, 
  ensure they are available globally or imported.
*/
</style>