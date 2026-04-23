<template>
    <div dir="ltr" class="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-x-2">

        <div @click="prevPage"
            class="flex w-10 h-10 rounded-xl border-2   justify-center gap-x-1 items-center select-none transition-all duration-200 ease-in-out group shrink-0"
            :class="[hasPrev ? 'cursor-pointer border-outline-variant hover:border-primary opacity-100' : ' opacity-65 cursor-not-allowed border-outline-variant/65']">
            <BIcon weight="bold" class="w-5 h-5 transition-all duration-200 ease-in-out ltr:rotate-180 rtl:rotate-0"
                :class="[hasPrev ? ' fill-on-surface group-hover:fill-primary group-hover:opacity-100 opacity-50' : 'opacity-35 fill-on-surface']"
                icon="PhCaretLeft" />
        </div>

        <div class="flex select-none items-center h-10 gap-x-2">
            <template v-for="(p, index) in visiblePages" :key="index">
                <div v-if="p === '...'"
                    class=" w-10 h-10 border-2 border-outline-variant rounded-xl flex items-center justify-center text-on-background select-none">
                    ...
                </div>

                <div v-else @click="setPage(p)"
                    class=" w-10 h-10 border-2 border-outline-variant hover:border-primary rounded-xl h transition-all duration-200 ease-in-out cursor-pointer flex  items-center justify-center text-label-md"
                    :class="[
                        p === page
                            ? 'bg-primary border-primary text-on-primary font-bold'
                            : 'text-on-surface/50 hover:bg-surface-container hover:text-primary'
                    ]">
                    {{ p }}
                </div>
            </template>
        </div>

        <div @click="nextPage"
            class="flex w-10 h-10 border-2  rounded-xl  justify-center items-center select-none transition-all duration-200 ease-in-out group shrink-0"
            :class="[hasNext ? 'cursor-pointer border-outline-variant hover:border-primary opacity-100' : ' opacity-65 cursor-not-allowed border-outline-variant/65']">
            <BIcon weight="bold" class="w-5 h-5  transition-all duration-200 ease-in-out ltr:rotate-180 rtl:rotate-0"
                :class="[hasNext ? ' fill-on-surface group-hover:fill-primary group-hover:opacity-100 opacity-50' : 'opacity-35 fill-on-surface']"
                icon="PhCaretRight" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { useWindowSize } from '#imports';
import { useI18n } from '#imports';

export default defineComponent({
    name: 'ThePagination',
    props: {
        modelValue: {
            type: Number,
            required: true,
        },
        maxPages: {
            type: Number,
            default: 1
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { t } = useI18n();
        const { width } = useWindowSize();

        // Tailwind's 'sm' breakpoint is 640px
        const isMobile = computed(() => width.value < 640);

        const page = ref(props.modelValue);

        watch(() => props.modelValue, (newVal) => {
            page.value = newVal;
        });

        watch(() => page.value, (newVal) => {
            emit('update:modelValue', newVal);
        });

        const hasPrev = computed(() => page.value > 1);
        const hasNext = computed(() => page.value < props.maxPages);

        const prevPage = () => {
            if (hasPrev.value) page.value--;
        };

        const nextPage = () => {
            if (hasNext.value) page.value++;
        };

        const setPage = (p: number | string) => {
            if (typeof p === 'number') {
                page.value = p;
            }
        };

        // --- The Responsive Ellipsis Logic ---
        const visiblePages = computed(() => {
            const total = props.maxPages;
            const current = page.value;

            // MOBILE LOGIC (Threshold = 4)
            if (isMobile.value) {
                if (total <= 4) {
                    return Array.from({ length: total }, (_, i) => i + 1);
                }

                // Near Start
                if (current <= 2) {
                    return [1, 2, 3, '...', total];
                }
                // Near End
                else if (current >= total - 1) {
                    return [1, '...', total - 2, total - 1, total];
                }
                // Middle
                else {
                    return [1, '...', current, '...', total];
                }
            }

            // DESKTOP LOGIC (Threshold = 6)
            else {
                if (total <= 6) {
                    return Array.from({ length: total }, (_, i) => i + 1);
                }

                if (current <= 3) {
                    return [1, 2, 3, 4, '...', total];
                } else if (current >= total - 2) {
                    return [1, '...', total - 3, total - 2, total - 1, total];
                } else {
                    return [1, '...', current - 1, current, current + 1, '...', total];
                }
            }
        });

        const jumpToPage = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!target.value) return;

            let val = parseInt(target.value);
            if (!isNaN(val)) {
                if (val < 1) val = 1;
                if (val > props.maxPages) val = props.maxPages;

                page.value = val;
                target.value = '';
                target.blur();
            }
        };

        return {
            t,
            page,
            hasPrev,
            hasNext,
            prevPage,
            nextPage,
            setPage,
            visiblePages,
            jumpToPage
        };
    }
});
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>