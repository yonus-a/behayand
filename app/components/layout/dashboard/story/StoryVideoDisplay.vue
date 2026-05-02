<!-- Inside StoryVideoDisplay.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Story } from '~/types/story';

const props = defineProps<{ story: Story; isPaused: boolean }>();
const emit = defineEmits(['ready', 'metadata', 'playing', 'ended']);

const videoRef = ref<HTMLVideoElement | null>(null);
const videoStarted = ref(false);
const generatedThumbnail = ref('');

// 1. Start false to prevent the initial flash.
const isMediaLoading = ref(false); 
let loadingTimeout: any = null;

const resolvedThumbnail = computed(() => {
    return props.story.thumbnail || generatedThumbnail.value || '';
});

// 2. Debounce the waiting state to prevent flickering during micro-buffers
const onWaiting = () => {
    // Only show spinner if the story isn't already preloaded and it takes time
    if (!props.story.isLoaded) {
        loadingTimeout = setTimeout(() => {
            isMediaLoading.value = true;
        }, 150);
    }
};

const onPlaying = () => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    videoStarted.value = true;
    isMediaLoading.value = false;
    emit('playing');
};

const onReady = () => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    isMediaLoading.value = false;
    // Mark as read when ready
    emit('ready');
};

onMounted(() => {
    // 3. If preloaded, signal ready immediately so the store marks it as read
    if (props.story.isLoaded) {
        emit('ready');
    } else {
        // Only consider it "loading" if it's not preloaded
        isMediaLoading.value = true;
    }

    if (!props.isPaused && videoRef.value) {
        videoRef.value.currentTime = 0;
        videoRef.value.play().catch(() => {});
    }
});

onUnmounted(() => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    if (videoRef.value) {
        videoRef.value.pause();
        videoRef.value.src = "";
        videoRef.value.load();
    }
});
</script>

<template>
    <div class="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
        <BImage
            v-if="(!videoStarted || isPaused) && resolvedThumbnail"
            :src="resolvedThumbnail"
            class="w-full h-full object-cover absolute inset-0 z-20"
        />

        <video 
            ref="videoRef"
            :src="story.localBlobUrl || story.mediaUrl"
            class="w-full h-full object-cover absolute inset-0 z-10" 
            playsinline 
            @loadedmetadata="onMetadata"
            @playing="onPlaying" 
            @waiting="onWaiting"
            @canplaythrough="onReady" 
            @ended="$emit('ended')"
        ></video>

        <div class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <!-- Spinner only appears if isMediaLoading is true after the 150ms delay -->
            <div v-if="isMediaLoading" class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div v-else-if="isPaused" class="hidden md:block">
                <BIcon icon="PhPlay" class="w-16 h-16 fill-white" />
            </div>
        </div>
    </div>
</template>