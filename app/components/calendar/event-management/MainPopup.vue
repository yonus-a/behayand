<template>
    <BPopup no-padding ref="popup">
        <CreateEvent v-if="mode === 'create'" />
    </BPopup>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Popup } from '~/types/components/popup';
import CreateEvent from './CreateEvent.vue';
type EventPopupModes = 'create' | ''
export default defineComponent({
    name: 'EventPopup',
    components: {
        CreateEvent,
    },
    setup(_, { expose }) {
        const popup = ref<Popup | null>(null)
        const mode = ref<EventPopupModes>('create')

        const open = () => {
            popup.value?.open()
        }

        const close = () => {
            popup.value?.close()
        }

        expose({ open, close })

        return {
            popup,
            mode,
        }
    }
})

</script>