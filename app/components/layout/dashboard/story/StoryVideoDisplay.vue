<!-- VideoStoryDisplay.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Story } from '~/types/story';

const props = defineProps<{ story: Story; isPaused: boolean }>();
const emit = defineEmits(['ready', 'metadata', 'playing', 'ended']);

const videoRef = ref<HTMLVideoElement | null>(null);
const videoStarted = ref(false);
const isMediaLoading = ref(false);
let loadingTimeout: any = null;

// Watch the isPaused prop and control the actual video element
watch(() => props.isPaused, (newPausedState) => {
    if (!videoRef.value) return;
    
    if (newPausedState) {
        videoRef.value.pause();
    } else {
        // Only resume if the overlay is actually open
        videoRef.value.play().catch(() => {
            // Browsers may block play() if not triggered by user gesture
        });
    }
}, { immediate: true }); // Check state immediately on mount

const onPlaying = () => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    videoStarted.value = true;
    isMediaLoading.value = false;
    emit('playing');
};

const onReady = () => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    isMediaLoading.value = false;
    emit('ready');
};

onMounted(() => {
    if (props.story.isLoaded) emit('ready');
    
    // Initial play state check
    if (!props.isPaused && videoRef.value) {
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
        <!-- Thumbnail only shows before video starts -->
        <BImage
            v-if="!videoStarted && story.thumbnail"
            :src="story.thumbnail"
            class="w-full h-full object-cover absolute inset-0 z-20"
        />

        <video 
            ref="videoRef"
            :src="story.localBlobUrl || story.mediaUrl"
            class="w-full h-full object-cover absolute inset-0 z-10" 
            playsinline 
            @playing="onPlaying" 
            @canplaythrough="onReady" 
            @ended="$emit('ended')"
        ></video>

        <div class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div v-if="isMediaLoading" class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <!-- Icon visibility is controlled by the parent's isPaused state -->
            <div v-else-if="isPaused" class="hidden md:block">
                <BIcon icon="PhPlay" class="w-16 h-16 fill-white" />
            </div>
        </div>
    </div>
</template>