<template>
    <div class=" w-full h-full">
        <CalendarHeaderItem :mode="mode" :days="headers" />
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType, watch } from 'vue';
import { useCalendarDate } from '~/composables/calendar/useCalendarDate';
import type { CalendarMode } from '~/types/components/calendar';
import CalendarHeaderItem from './CalendarHeaderItem.vue';
export default defineComponent({
    name: 'CalendarGrid',
    components: {
        CalendarHeaderItem,
    },
    props: {
        range: {
            type: Object as PropType<{ start: Date; end: Date } | null>,
            required: true,
        },
        mode: {
            type: String as PropType<CalendarMode>,
            default: 'monthly'
        }
    },
    setup(props) {
        const { getCalendarHeaders } = useCalendarDate();

        const headers = computed(() => {
            return getCalendarHeaders(props.range, props.mode);
        });

        onMounted(() => {
            console.log(headers.value)
        })

        watch(() => headers.value, () => {
            console.log(headers.value)
        }, { deep: true, immediate: true })

        return {
            headers,
        }
    }
})
</script>