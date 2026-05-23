<template>
  <div class="flex flex-col w-full h-dvh bg-surface">
    <div class="w-full shrink-0 h-16 flex justify-between items-center px-5 border-b border-b-outline-variant">
      <!-- Left placeholder -->
      <div class="w-5"></div>

      <!-- Center title -->
      <div class="select-none text-on-surface text-label-lg font-bold">
        {{ headerTitle ? t(headerTitle) : '' }}
      </div>

      <!-- Right section: Custom actions (injectable) + Default actions (back button / empty) -->
      <div class="flex items-center gap-x-2">
        <div id="header-custom-actions"></div>
        <div id="header-default-actions" :class="{ hidden: hasCustomActions }">
          <BIcon v-if="showBack" :icon="backIcon || 'PhArrowLeft'"
            class="cursor-pointer w-6 h-6 fill-on-surface"
            @click="handleBack" />
          <div v-else class="w-6"></div>
        </div>
      </div>
    </div>

    <div class="w-full min-h-0 max-h-[calc(100vh-64px)] flex-1 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n, useLocalePath } from '#imports';

const localePath = useLocalePath();

const props = defineProps<{
  headerTitle?: string;
  backPath?: string;
  backIcon?: string;
  showBack?: boolean;
}>();

const { t } = useI18n();
const router = useRouter();

const handleBack = () => {
  if (props.backPath) {
    router.push(localePath(props.backPath));
  } else {
    router.go(-1);
  }
};

// --- Toggle for custom header actions ---
const hasCustomActions = ref(false);
let observer: MutationObserver | null = null;

onMounted(() => {
  const target = document.getElementById('header-custom-actions');
  if (target) {
    nextTick(() => {
      hasCustomActions.value = target.children.length > 0;
    });

    observer = new MutationObserver(() => {
      hasCustomActions.value = target.children.length > 0;
    });
    observer.observe(target, { childList: true });
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>