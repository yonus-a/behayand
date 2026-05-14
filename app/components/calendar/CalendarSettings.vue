<template>
    <div class=" w-full flex justify-center">
        <div class=" px-6 py-4 w-98 max-w-dvw select-none text-on-surface">
            <div class=" flex items-center gap-x-3">
                <BIcon icon="PhX" class=" cursor-pointer w-4 h-4 " @click="closeSettings" />
                <div class=" flex items-center text-label-sm">{{ t('calendar.filters.title') }}</div>
            </div>
            <BCheckBox v-model="showHolidays" :label="t('calendar.filters.showHolidays')" class=" mt-4" />
            <div class=" w-full mt-4">
                <BSelect :title="t('calendar.filters.calendar.title')" :placeholder="t('general.select')"
                    v-model="chosenCalendar" />
                <BSelect :title="t('calendar.filters.startOfWeek')" :placeholder="t('general.select')"
                    v-model="chosenStartOfWeek" />
                <BSelect :title="t('calendar.filters.timeZone')" :placeholder="t('general.select')"
                    v-model="chosenTimeZone" />
                <div class=" w-1/3 flex flex-col gap-y-3">
                    <div class=" text-body-sm opacity-50">{{ t('calendar.filters.displaySettings.title') }}</div>
                    <BCheckBox v-model="showAi" :label="t('calendar.filters.displaySettings.ai')" />
                    <BCheckBox v-model="showMedicince" :label="t('calendar.filters.displaySettings.medicine')" />
                    <BCheckBox v-model="showServices" :label="t('calendar.filters.displaySettings.services')" />
                    <BCheckBox v-model="showTasks" :label="t('calendar.filters.displaySettings.task')" />
                </div>
                <div class=" mt-4 w-full">
                    <BButton :disabled="!hasChanges" class=" min-w-full" :text="t('calendar.filters.apply')"
                        @click="applyFilters" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from '#imports';

export default defineComponent({
    name: 'CalendarSettings',
    emits: ['close'],
    setup(_, { emit }) {
        const { t } = useI18n()
        const chosenCalendar = ref('')
        const chosenStartOfWeek = ref('')
        const chosenTimeZone = ref('')
        const showAi = ref(true)
        const showMedicince = ref(true)
        const showServices = ref(true)
        const showTasks = ref(true)
        const showHolidays = ref(true)
        const initialSettings = ref({})

        const hasChanges = computed(() => //some logic
            true
        )

        const closeSettings = () => {
            emit('close')
        }

        const applyFilters = () => {
            emit('close')
        }

        return {
            t,
            chosenCalendar,
            chosenStartOfWeek,
            chosenTimeZone,
            showHolidays,
            showAi,
            showMedicince,
            showServices,
            hasChanges,
            showTasks,
            applyFilters,
            closeSettings,
        }
    }
})
</script>