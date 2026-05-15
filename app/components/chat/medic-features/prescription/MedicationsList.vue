<template>
    <div class="w-full  h-full min-h-full flex flex-col gap-y-4 ">
        <div
            class=" w-full overflow-y-auto min-h-32 md:overflow-hidden lg:flex-1  rounded-xl bg-surface-variant select-none lg:px-3 lg:pt-3 flex flex-col gap-y-3">
            <div class=" lg:block hidden shrink-0 text-body-sm text-on-surface/50 ">{{ t('chat.prescription.medicine') }}</div>
            <div class=" w-full flex flex-col flex-1 gap-y-1 lg:gap-y-2 overflow-y-auto">
                <MedicineDisplay v-for="medicine in medications" :key="medicine.id" :medicine="medicine" />
            </div>
        </div>
        <div class=" w-full hidden lg:flex justify-end items-center">
            <BButton class=" min-w-90 w-90 max-w-full" :text="t('chat.prescription.submit')" @click="confirmSelections" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { PrescribedMedication } from '~/types/medication';
import { useI18n } from '#imports';
import MedicineDisplay from './MedicineDisplay.vue';
export default defineComponent({
    name: 'MedicationsList',
    components: {
        MedicineDisplay,
    },
    props: {
        medications: {
            type: Array as PropType<PrescribedMedication[]>,
            default: () => []
        },
    },
    setup(props) {
        const { t } = useI18n()


        const confirmSelections = () => {

        }

        return {
            t,
            confirmSelections,
        }
    }
})
</script>