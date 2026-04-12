<template>
    <div 
        @click="toggleCheck"
        class="group inline-flex items-center cursor-pointer transition-all duration-200"
        :class="{ 'gap-x-3': hasContent }"
    >
        <div class="shrink-0 flex items-center justify-center">
            
            <div v-if="mode === 'checkbox'"
                class="w-5 h-5 p-0.5 relative rounded-md flex justify-center items-center overflow-hidden bg-outline transition-all duration-200">
                <div class="absolute inset-0 transition-opacity duration-200 ease-in-out bg-diamond-primary-secondary"
                    :class="isActive ? 'opacity-100' : 'opacity-0'"></div>
                <div class="z-10 w-full h-full bg-surface relative rounded-[3px] overflow-hidden flex justify-center items-center">
                    <div class="absolute inset-0 transition-all duration-200 bg-diamond-primary-secondary flex justify-center items-center ease-in-out"
                        :class="isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'">
                        <BIcon class="w-3.5 h-3.5 fill-white" weight="bold" icon="PhCheck" />
                    </div>
                </div>
            </div>

            <div v-else-if="mode === 'radio'"
                class="w-5 h-5 relative rounded-full flex justify-center items-center overflow-hidden bg-outline transition-all duration-200">
                <div class="absolute inset-0 transition-opacity duration-200 ease-in-out bg-diamond-primary-secondary"
                    :class="isActive ? 'opacity-100' : 'opacity-0'"></div>
                <div class="z-10 bg-surface rounded-full transition-all duration-200 ease-in-out"
                    :class="isActive ? 'w-2.5 h-2.5' : 'w-4 h-4'"></div>
            </div>

            <div v-else-if="mode === 'switch'" :dir="dir"
                class="h-5 w-9 p-1 relative rounded-full flex items-center bg-outline overflow-hidden transition-all duration-200">
                <div class="absolute inset-0 transition-opacity duration-200 ease-in-out bg-diamond-primary-secondary"
                    :class="isActive ? 'opacity-100' : 'opacity-0'"></div>
                <div class="z-10 w-3 h-3 bg-surface rounded-full transition-transform duration-200 ease-in-out"
                    :style="{ transform: switchTransform }"></div>
            </div>
        </div>

        <div v-if="hasContent" class="select-none flex-1">
            <slot>
                <span class="text-body-md text-on-surface">{{ label }}</span>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue';
import { useLocale } from '#imports';

// 1. Refactor to Script Setup with Props/Emits
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
        required: true,
    },
    mode: {
        type: String as () => 'checkbox' | 'radio' | 'switch',
        default: 'checkbox'
    },
    label: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const { dir } = useLocale();

// State management
const isActive = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    isActive.value = newVal;
});

const toggleCheck = () => {
    emit('update:modelValue', !isActive.value);
};

// 2. Determine if content exists (via prop or slot) to apply gap-x-3
const hasContent = computed(() => !!props.label || !!slots.default);

// 3. Switch movement logic
const switchTransform = computed(() => {
    if (!isActive.value) return 'translateX(0)';
    // Movement: Container (36px) - Padding (8px) - Knob (12px) = 16px
    return dir.value === 'rtl' ? 'translateX(-16px)' : 'translateX(16px)';
});
</script>

<style scoped>
/* Keeping your general gradient utility if needed elsewhere */
.border-gradient-diamond {
    position: relative;
    border: none !important;
}
.border-gradient-diamond::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: var(--background-image-diamond-primary-secondary);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}
</style>