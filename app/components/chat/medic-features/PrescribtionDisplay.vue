<template>
    <BPopup ref="popup" no-padding :has-close="false">
        <div class=" w-full flex px-6 py-4 justify-center">
            <div class=" w-dvw max-w-86">
                <div class=" mb-4 flex items-center gap-x-3">
                    <BIcon icon="PhX" class=" cursor-pointer w-4 h-4 fill-on-surface" @click="closePopup" />
                    <div class=" select-none text-on-surface text-label-sm">{{ t('chat.prescription.title') }}</div>
                </div>
                <BSelect :options="periodOptions" v-model="selectedPeriod.value" :color="selectedPeriod.color"
                    :message="selectedPeriod.message" :title="t('chat.prescription.initialDetection')"
                    :placeholder="t('general.select')" />
                <PrescriptionDetails />
            </div>
            <MedicationsList :medications="prescribedMeds" />
        </div>
    </BPopup>
</template>
<script lang="ts">
import { defineComponent, useTemplateRef, computed, ref } from 'vue';
import { useChatActionStore, useI18n } from '#imports';
import type { Popup } from '~/types/components/popup';
import type { PrescribedMedication } from '~/types/medication';
import type { DropdownOption } from '~/types/components/select';
import PrescriptionDetails from './prescription/PrescriptionDetails.vue';
import MedicationsList from './prescription/MedicationsList.vue';
import HospitalizationForm from './prescription/HospitalizationForm.vue';

export default defineComponent({
    name: 'PrescriptionDisplay',
    components: {
        PrescriptionDetails,
        MedicationsList,
        HospitalizationForm,
    },
    setup() {
        const { t } = useI18n()
        const chatActionStore = useChatActionStore()
        const popup = useTemplateRef<Popup>('popup')
        const prescribedMeds = ref<PrescribedMedication[]>([])

        const periodOptions = computed<DropdownOption[]>(() => [
            {
                value: 'hospitalization',
                label: t('chat.prescription.periodOptions.hospitalization')
            },
            {
                value: 'prescription',
                label: t('chat.prescription.periodOptions.prescriptionDrugs')
            }
        ])

        const selectedPeriod = ref({
            value: '', color: 'primary', message: ''
        })

        chatActionStore.prescriptionBus.on((conversationId) => {
            console.log('Prescription triggered for conversation:', conversationId);
            handleOpenPrescription(conversationId);
        });

        const handleOpenPrescription = (id: number) => {
            popup.value?.open()
        };
        const unsubscribe = chatActionStore.prescriptionBus.on((id) => {
        });

        const closePopup = () => {
            popup.value?.close()
        }

        unsubscribe();

        return {
            periodOptions,
            popup,
            closePopup,
            prescribedMeds,
            selectedPeriod,
            t,
        }
    }
})
</script>