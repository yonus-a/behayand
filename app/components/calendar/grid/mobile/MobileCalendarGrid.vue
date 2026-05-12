<template>
    <div class=" w-full pt-6 px-4 relative">
        <div class=" w-dvw fixed right-0 -translate-y-6 pointer-events-none z-1000 h-6 bg-linear-to-b from-surface to-surface/0"></div>
        <div id="mobile-grid" class="w-full" style="touch-action: pan-x;" @touchstart="handleTouchStart"
            @touchmove="handleTouchMove" @touchend="handleTouchEnd">

            <div class="select-none text-[10px] text-on-surface/50 w-full flex items-center justify-between">
                <div class="aspect-square w-8 shrink-0 flex items-center justify-center" v-for="day in weekDays"
                    :key="day.dayOfWeek">
                    <div>{{ day.fullName }}</div>
                </div>
            </div>

            <div class="w-full mt-4 grid grid-cols-7 gap-x-5 gap-y-4">
                <div v-for="(day, index) in days" :key="index" :class="[
                    'transition-opacity duration-200',
                    isOtherMonthFunc(day.date) ? 'opacity-0 pointer-events-none' : 'opacity-100'
                ]">
                    <MobileDayHolder :is-selected="isDaySelected(day)" :expand-progress="progress"
                        :is-dragging="isDragging" @select="selectDay" :day="day"
                        :events="eventsByDay.get(new Date(day.date).toDateString()) || []" />
                </div>
            </div>
        </div>
        <div class=" transition-all duration-200 ease-in-out overflow-hidden text-wrap whitespace-nowrap w-full"
            :class="[showEventsList ? ' h-auto opacity-100' : 'opacity-0 h-0']">
            <div class=" py-3 text-on-surface text-title-md select-none">{{ formatDate(selectedDate) }}</div>
            <div class=" w-full flex flex-col gap-y-2">
                <EventDisplay :loading="isLoading" v-for="event in eventsList" :key="event.id" :event="event" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, type PropType } from 'vue';
import { useCalendarDate } from '~/composables/calendar/useCalendarDate';
import type { CalendarEventPayload } from '~/types/calendar';
import type { CalendarDay } from '~/types/components/calendar';
import MobileDayHolder from './MobileDayHolder.vue';
import EventDisplay from './EventDisplay.vue';
import { useDate } from '#imports';
export default defineComponent({
    name: 'MobileCalendarGrid',
    components: {
        MobileDayHolder,
        EventDisplay,
    },
    props: {
        days: {
            type: Array as PropType<CalendarDay[]>,
            default: () => []
        },
        eventsByDay: {
            type: Object as PropType<Map<string, CalendarEventPayload[]>>,
            required: true
        },
        isOtherMonthFunc: {
            type: Function as PropType<(date: Date) => boolean>,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const { formatDate } = useDate()
        const { getWeekDayNames } = useCalendarDate()
        const isLoading = computed(() => props.loading)
        const weekDays = computed(() => getWeekDayNames.value);


        const showEventsList = ref(false);
        const eventsList = ref<CalendarEventPayload[]>([]);
        const selectedDate = ref('');

        const selectDay = (day: CalendarDay) => {
            const dateKey = new Date(day.date).toDateString();
            selectedDate.value = dateKey;

            const foundEvents = props.eventsByDay.get(dateKey);

            if (foundEvents && foundEvents.length > 0) {
                eventsList.value = [...foundEvents];
                showEventsList.value = true;
            } else {
                showEventsList.value = false;
            }
        };

        onMounted(() => {
            const todayDate = new Date();
            const todayKey = todayDate.toDateString();
            selectedDate.value = todayKey;

            const todayEvents = props.eventsByDay.get(todayKey);
            if (todayEvents && todayEvents.length > 0) {
                eventsList.value = [...todayEvents];
                showEventsList.value = true;
            }
        });

        const isDaySelected = (day: CalendarDay) => {
            return selectedDate.value === new Date(day.date).toDateString()
        }

        // --- OPTIMIZED SWIPE LOGIC ---
        const progress = ref(0);
        const isDragging = ref(false);

        let startY = 0;
        let startProgress = 0;
        const maxDragDistance = 120;

        // This lock prevents Vue from queuing up too many updates per frame
        let ticking = false;

        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            startProgress = progress.value;
            isDragging.value = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging.value) return;

            const deltaY = e.touches[0].clientY - startY;

            // Only fire the update if the browser is ready for the next frame
            if (!ticking) {
                requestAnimationFrame(() => {
                    let newProgress = startProgress + (deltaY / maxDragDistance);
                    progress.value = Math.max(0, Math.min(1, newProgress));
                    ticking = false; // Unlock for the next frame
                });
                ticking = true; // Lock
            }
        };

        const handleTouchEnd = () => {
            isDragging.value = false;

            if (progress.value > 0.25 && startProgress === 0) {
                progress.value = 1;
            } else if (progress.value < 0.75 && startProgress === 1) {
                progress.value = 0;
            } else {
                progress.value = startProgress;
            }
        };

        return {
            isDaySelected,
            weekDays,
            formatDate,
            selectDay,
            selectedDate,
            showEventsList,
            progress,
            isDragging,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            eventsList,
            isLoading,
        }
    }
})
</script>