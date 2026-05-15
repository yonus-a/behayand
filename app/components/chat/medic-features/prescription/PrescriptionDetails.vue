<template>
    <div class=" w-full ">
        <BSelect searchable v-model="selectedMedication.value" :color="selectedMedication.color"
            :message="selectedMedication.message" :placeholder="t('general.select')"
            :title="t('chat.prescription.medicationName')" />
        <BSelect :title="t('chat.prescription.brands')" :placeholder="t('general.select')" v-model="selectedBrand.value"
            :color="selectedBrand.color" :message="selectedBrand.message" />
        <BInput v-model="usageDose.value" :color="usageDose.color" :message="usageDose.message"
            :placeholder="t('general.write')" :title="t('chat.prescription.dose')" />
        <BInput :placeholder="t('general.write')" :title="t('chat.prescription.repetitionAmount')"
            v-model="repetitionAmount.value" :color="repetitionAmount.color" :message="repetitionAmount.message"
            type="number" :options="repetitionTypes" :selected-option-key="repetitionType" />
        <BInput textarea v-model="usageMethod.value" :color="usageMethod.color" :message="usageMethod.message"
            :title="t('chat.prescription.usageMethod')" :placeholder="t('general.write')" />
        <BButton :disabled="hasErrors" right-icon="PhPlus" :text="t('chat.prescription.addMedications')" type="outline"
            @click="validateFields" />
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useI18n, useMedicationStore } from '#imports';
import type { MenuOption } from '~/types/components/menu-options';
import type { RepetitionTypes } from '~/types/medication';
export default defineComponent({
    name: 'PrescriptionDisplay',
    setup() {
        const { t } = useI18n()
        const medicationStore = useMedicationStore()
        const isLoadingSearchResults = computed(() => medicationStore.isLoading)
        const results = computed(() => medicationStore.searchResults)
        const hasErrors = ref(false)




        const repetitionTypes = computed<MenuOption[]>(() => [
            {
                key: 'day',
                label: t('calendar.form.repetition.day'),
            },
            {
                key: 'hour',
                label: t('calendar.form.repetition.hour'),
            },

        ])

        const repetitionType = ref<RepetitionTypes>(repetitionTypes.value[0]?.key)



        const usageDose = ref({
            value: '', color: 'primary', message: ''
        })

        const repetitionAmount = ref({
            value: '', color: 'primary', message: ''
        })

        const selectedMedication = ref({
            value: '', color: 'primary', message: ''
        })

        const selectedBrand = ref({
            value: '', color: 'primary', message: ''
        })

        const usageMethod = ref({
            value: '', color: 'primary', message: ''
        })




        const validateFields = () => {
            if (hasErrors.value) return

            if (!hasErrors.value) {
                submitMedication()
            }
        }

        const submitMedication = () => {

        }

        return {
            validateFields,
            selectedBrand,
            repetitionAmount,
            repetitionTypes,
            selectedMedication,
            usageMethod,
            repetitionType,
            usageDose,
            hasErrors,
            t,
        }
    }
})
</script>