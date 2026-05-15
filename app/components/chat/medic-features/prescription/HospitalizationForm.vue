<template>
    <div class=" w-full">
        <BSelect :placeholder="t('general.select')" :title="t('chat.prescription.priority.title')" :options="priorities"
            v-model="priority.value" :color="priority.color" :message="priority.message" />
        <BInput :title="t('chat.prescription.timePeriod')" :placeholder="t('general.write')" v-model="period.value"
            :color="period.color" :message="period.message" />
        <BInput :title="t('chat.prescription.descriptions')" :placeholder="t('general.write')"
            v-model="descriptions.value" :color="descriptions.color" :message="descriptions.message" />
        <BButton @click="validateFields" class=" min-w-full" :text="t('chat.prescription.submit')"
            :disabled="hasErrors" />
    </div>
</template>
<script lang="ts">
import { defineComponent, watch, computed, ref } from 'vue';
import { useI18n } from '#imports';

export default defineComponent({
    name: 'HospitalizationForm',
    setup() {
        const { t } = useI18n()
        const hasErrors = ref(false)
        const period = ref({ value: '', color: 'primary', message: '' })
        const priority = ref({ value: '', color: 'primary', message: '' })
        const descriptions = ref({ value: '', color: 'primary', message: '' })

        const priorities = computed(() => [
            {
                label: t('chat.prescription.priority.high'),
                value: 'high'
            },
            {
                label: t('chat.prescription.priority.medium'),
                value: 'medium'
            },
            {
                label: t('chat.prescription.priority.low'),
                value: 'low'
            },
        ])

        const validateFields = () => {
            if (hasErrors.value) return

            if (!hasErrors.value) {
                submitFields()
            }
        }

        const submitFields = () => {

        }

        return {
            validateFields,
            t,
            priorities,
            priority,
            period,
            hasErrors,
            descriptions,
        }
    }
})
</script>
