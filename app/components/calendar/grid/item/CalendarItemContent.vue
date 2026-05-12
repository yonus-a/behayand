<template>
    <div class=" w-25 h-25 "></div>
</template>
<script lang="ts">
import { defineComponent, type PropType, ref, computed } from 'vue';
import type { CalendarEventPayload } from '~/types/calendar';

export default defineComponent({
    name: 'CalendarItemDisplay',
    props: {
        event: {
            type: Object as PropType<CalendarEventPayload | null>,
            required: true,
        }
    },
    emits: ['edit', 'delete', 'close'],
    setup() {


        const actions = computed(() => {
            let items = [
                {
                    icon: 'PhX',
                    key: 'close',
                    active: true,
                },
                {
                    icon: 'PhPen',
                    key: 'edit',
                    active: true,
                },
                {
                    icon: 'PhTrash',
                    key: 'delete',
                    active: true,
                }
            ]
            return items.filter((item) => item.active === true)
        })

        

        return {

        }
    }
})
</script>