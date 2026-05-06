<template>
    <div class=" overflow-hidden border border-outline-variant/50 w-full relative h-full">
        <div class=" absolute top-0 left-0 z-10 w-full h-full p-4 relative">
            <CalendarDayBadge :day="day" />
        </div>
        <div class="w-full h-full pointer-events-none absolute top-0 left-0">
            <CalendarPattern v-if="otherMonth" class="absolute inset-0 z-0 pointer-events-none" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { CalendarDay } from '~/types/components/calendar';
import CalendarDayBadge from './CalendarDayBadge.vue';
import OtherMonthsBackground from '/images/calendar/other-months.svg'
import CalendarPattern from './CalendarPattern.vue';

export default defineComponent({
    name: 'CalendarDayHolder',
    props: {
        day: {
            type: Object as PropType<CalendarDay>,
            required: true,
        },
        otherMonth: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        CalendarDayBadge,
        CalendarPattern,
    },
    setup(props) {


        const getDayItemColor = (day: CalendarDay) => {
            let fillStyle = 'border-outline-variant bg-surface'
            let textStyle = 'text-on-surface/50'
            if (day.isToday) {
                fillStyle = ' bg-diamond-black dark:bg-diamond-surface border-outline-variant/0'
                textStyle = 'text-surface'
            }
            if (day.isWeekend) {
                textStyle = 'text-error'
            }
            return {
                fill: fillStyle,
                text: textStyle,
            }
        }

        return {
            getDayItemColor,
            OtherMonthsBackground,
        }
    }
})
</script>