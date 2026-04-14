<template>
    <Teleport to="body">
        <div class="w-full md:max-w-203 max-w-dvw p-5 fixed bottom-0 z-100 pointer-events-none">
            <div 
                class="py-3 px-4 rounded-xl flex items-center transition-all duration-300 ease-in-out gap-x-2 pointer-events-auto"
                :class="[backgroundColor, isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0']"
            >
                <BIcon :icon="toastIcon" class="w-5 h-5 fill-white shrink-0" />
                <div class="flex-1 select-none text-white text-label-md">{{ toastMessage }}</div>
                <BIcon 
                    icon="PhX" 
                    @click="closeToast" 
                    class="cursor-pointer w-5 h-5 fill-white shrink-0 hover:opacity-70 transition-opacity" 
                />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const isOpen = ref(false);
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info');
const toastMessage = ref('');
let timer: any = null;

const openToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 4000
) => {
    if (timer) clearTimeout(timer);

    toastType.value = type;
    toastMessage.value = message;
    isOpen.value = true;

    timer = setTimeout(() => {
        closeToast();
    }, duration);
};

const closeToast = () => {
    isOpen.value = false;
};

const backgroundColor = computed(() => {
    switch (toastType.value) {
        case 'success': return 'bg-primary'; // Greenish based on your theme
        case 'error': return 'bg-error';
        case 'warning': return 'bg-orange-500';
        case 'info': return 'bg-on-surface';
        default: return 'bg-on-surface';
    }
});

const toastIcon = computed(() => {
    switch (toastType.value) {
        case 'success': return 'PhCheckCircle';
        case 'error': return 'PhWarningOctagon';
        case 'warning': return 'PhWarning';
        case 'info': return 'PhInfo';
        default: return 'PhInfo';
    }
});

// Expose the methods so the composable can call them
defineExpose({
    openToast,
    closeToast
});
</script>