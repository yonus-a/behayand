<template>
  <div class="flex flex-col gap-y-2 w-full">
    <div class="p-4 w-full rounded-xl bg-surface-variant flex items-center gap-x-3 transition-all duration-200">

      <div v-image-pick="{ onSelect: onInitialPick }"
        class="relative cursor-pointer bg-primary-container h-15 w-15 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200">
        <template v-if="previewUrl">
          <img :src="previewUrl" class="w-full h-full object-cover transition-opacity duration-200" />
          <div
            class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <BIcon icon="PhCamera" class="w-6 h-6 fill-white" />
          </div>
        </template>

        <BIcon v-else icon="PhUserPlus" class="w-6 h-6 fill-on-primary-container transition-opacity duration-200" />
      </div>

      <div class="flex-1 select-none transition-all duration-200">
        <div class="text-label-md text-on-surface">
          {{ t('auth.profile.selectImage') }}
        </div>
      </div>
    </div>

    <BImageCrop ref="cropPopup" @cropped="onImageCropped" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '#imports';

const props = defineProps<{
  modelValue?: File | null
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const { t } = useI18n();
const cropPopup = ref<any>(null);
const previewUrl = ref<string | null>(null);

const onInitialPick = (path: string, file: File) => {
  if (cropPopup.value) {
    cropPopup.value.openPopup(file, path);
  }
};

const onImageCropped = (file: File, path: string) => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = path;

  emit('update:modelValue', file);
  emit('change', file);
};
</script>