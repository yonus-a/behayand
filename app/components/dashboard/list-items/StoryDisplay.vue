<template>
    <div 
        class="story-wrapper flex items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
        :class="[
            story.isRead ? 'border-outline' : 'border-primary',
            { 'is-pressed': isPressed }
        ]"
        @mousedown="handlePressStart"
        @mouseup="handlePressEnd"
        @mouseleave="handlePressEnd"
        @touchstart="handlePressStart"
        @touchend="handlePressEnd"
    >
        <div class="inner-circle overflow-hidden w-12 h-12 rounded-full border-2 border-surface">
            <BImage 
                :src="story.thumbnail" 
                class="min-w-full min-h-full max-w-full max-h-full h-full w-full object-cover" 
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import type { Story } from '~/types/story';

export default defineComponent({
    name: 'StoryDisplay',
    props: {
        story: {
            type: Object as PropType<Story>,
            required: true,
        }
    },
    setup() {
        const isPressed = ref(false);

        const handlePressStart = () => {
            isPressed.value = true;
        };

        const handlePressEnd = () => {
            isPressed.value = false;
        };

        return {
            isPressed,
            handlePressStart,
            handlePressEnd
        };
    }
})
</script>

<style scoped>
.story-wrapper {
    width: 52px; /* 13 * 4px roughly */
    height: 52px;
    border-width: 2px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    /* This ensures the scaling happens from the center */
    transform-origin: center;
    will-change: transform;
}

/* The Instagram "Shrink" */
.is-pressed {
    transform: scale(0.92);
    transition: transform 0.1s ease-out; /* Snap down quickly */
}

/* Border animation for Unread state */
.border-primary {
    /* Optional: add a subtle pulse if you want it to look "active" */
    animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
    0% { border-color: var(--color-primary-500); }
    50% { border-color: var(--color-primary-300); }
    100% { border-color: var(--color-primary-500); }
}

.inner-circle {
    /* Instagram has a tiny white gap between the border and the photo */
    box-shadow: 0 0 0 2px var(--bg-surface);
}
</style>