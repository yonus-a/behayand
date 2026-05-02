<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <BToast ref="toastComponent" />
  <Teleport to="body">
    <CallOverlay v-if="callStore.isVisible" />
  </Teleport>
</template>
<script setup lang="ts">
const { toastRef } = useAppToast()
const toastComponent = ref(null);
const callStore = useCallStore()
const { dir, locale } = useLocale();
const { colorMode } = useTheme();
const { t } = useI18n()
useHead({
  titleTemplate: (titleChunk) => {
    const siteName = t('seo.siteName');
    return titleChunk ? `${siteName} - ${titleChunk}` : siteName;
  },
  htmlAttrs: {
    dir: dir,
    lang: locale,
  }
});
onMounted(() => {
  toastRef.value = toastComponent.value;
});
</script>