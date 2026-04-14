<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <BToast ref="toastComponent" />
  </div>
</template>
<script setup lang="ts">
const { toastRef } = useAppToast()
const toastComponent = ref(null);

onMounted(() => {
  toastRef.value = toastComponent.value;
});
</script>