<template>
    <BPopup ref="popup">
        <div class=" w-100 h-100 flex items-center justify-center">
            <div class=" w-20">
                <BInput preset="time" />
            </div>
        </div>
    </BPopup>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Popup } from '~/types/components/popup';
export default defineComponent({
    name: 'EventPopup',
    setup(_, { expose }) {
        const popup = ref<Popup | null>(null)

        const open = () => {
            popup.value?.open()
        }

        const close = () => {
            popup.value?.close()
        }

        expose({ open, close })

        return {
            popup,
        }
    }
})

</script>