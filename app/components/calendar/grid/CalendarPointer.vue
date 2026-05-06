<template>
    <div 
        v-show="isVisible"
        class="absolute z-20 pointer-events-none -translate-y-1/2 flex items-center"
        :style="pointerStyle"
    >
        <div class="w-2.5 aspect-square rounded-full bg-diamond-error shrink-0"></div>
        <div class="h-0.5 flex-1 bg-diamond-error"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, computed, onMounted, onUnmounted } from 'vue';
import type { CalendarTimeRange, CalendarDay, CalendarMode } from '~/types/components/calendar';

export default defineComponent({
    name: 'CalendarPointer',
    props: {
        mode: {
            type: String as PropType<CalendarMode>,
            required: true
        },
        hours: {
            type: Object as PropType<CalendarTimeRange>,
            required: true
        },
        headers: {
            type: Array as PropType<CalendarDay[]>,
            required: true
        }
    },
    setup(props) {
        // Self-contained time tracking
        const currentTime = ref(new Date());
        let timeInterval: ReturnType<typeof setInterval>;

        onMounted(() => {
            // Keep real-time sync every 60 seconds
            timeInterval = setInterval(() => {
                currentTime.value = new Date();
            }, 60000);
        });

        onUnmounted(() => {
            if (timeInterval) clearInterval(timeInterval);
        });

        // Autonomous style calculation based on active mode
        const pointerStyle = computed(() => {
            if (!props.headers || props.headers.length === 0) return { display: 'none' };

            // 1. Is Today even in the currently rendered DOM?
            const todayIndex = props.headers.findIndex(day => day.isToday);
            if (todayIndex === -1) return { display: 'none' };

            const now = currentTime.value;
            const currentHourDecimal = now.getHours() + (now.getMinutes() / 60);

            // --- MONTHLY MODE MATH ---
            if (props.mode === 'monthly') {
                const totalColumns = 7;
                const totalItems = props.headers.length;
                const totalRows = Math.ceil(totalItems / 7); // Usually 5 or 6 weeks

                const row = Math.floor(todayIndex / 7);
                const col = todayIndex % 7;

                // Height of a single week row in percentage
                const cellHeightPct = 100 / totalRows; 
                
                // Proportion of the current time (0-24) mapped to the height of the specific cell
                const timeOffsetPct = (currentHourDecimal / 24) * cellHeightPct;

                return {
                    width: `${100 / totalColumns}%`,
                    top: `${(row * cellHeightPct) + timeOffsetPct}%`,
                    insetInlineStart: `${(col / totalColumns) * 100}%`,
                    // ONLY animate position, width snaps instantly to prevent stretching artifacts
                    transition: ''
                };
            }

            // --- DAILY / WEEKLY MODE MATH ---
            
            // Hide if current time is outside the visible hours (e.g., it's 23:00 but range is 6:00 to 20:00)
            if (currentHourDecimal < props.hours.start || currentHourDecimal > props.hours.end) {
                return { display: 'none' };
            }

            const totalColumns = props.headers.length;
            const totalRows = props.hours.end - props.hours.start + 1;

            return {
                width: `${100 / totalColumns}%`,
                top: `${((currentHourDecimal - props.hours.start) / totalRows) * 100}%`,
                insetInlineStart: `${(todayIndex / totalColumns) * 100}%`,
                // ONLY animate position, width snaps instantly
                transition: ''
            };
        });

        const isVisible = computed(() => pointerStyle.value.display !== 'none');

        return {
            pointerStyle,
            isVisible
        }
    }
})
</script>