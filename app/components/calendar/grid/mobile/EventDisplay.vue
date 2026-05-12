<template>
    <div
        class=" w-full overflow-hidden flex flex-col h-24 rounded-xl border border-outline-variant bg-surface relative">
        <div class=" w-full flex-1 "></div>
        <div class=" w-full h-1 shrink-0" :style="{ backgroundColor: event.color }"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import type { CalendarEventPayload } from '~/types/calendar';
export default defineComponent({
    name: 'EventDisplay',
    props: {
        event: {
            type: Object as PropType<CalendarEventPayload>,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const isLoading = computed(() => props.loading)



        return {
            isLoading,
        }
    }
})
</script>