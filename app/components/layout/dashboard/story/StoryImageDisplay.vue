<template>
    <div class="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
        <BImage
            :src="story.localBlobUrl || story.mediaUrl"
            class="w-full h-full object-cover absolute inset-0"
            @load="onLoad"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { Story } from '~/types/story';

const props = defineProps<{ story: Story }>();
const emit = defineEmits(['ready']);

const onLoad = () => {
    emit('ready');
};

onMounted(() => {
    // Instantly mark as read if it was preloaded from Blob
    if (props.story.isLoaded) {
        emit('ready');
    }
});
</script>