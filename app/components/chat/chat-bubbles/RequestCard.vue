<template>
    <div class=" p-3 bg-surface rounded-2xl shadow-floating">
        <div class=" h-20 w-40"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Contact } from '~/types/chat';
import type { Request } from '~/types/chat';
import { useI18n } from '#imports';



export default defineComponent({
    name: 'RequestCard',
    props: {
        request: {
            type: Object as PropType<Request>,
            required: true,
        },
        contact: {
            type: Object as PropType<Contact>,
            required: true,
        }
    },
    setup(props) {
        const { t } = useI18n()

        return {
            t,
        }
    }
})
</script>