<template>
    <div class=" w-full ">
        <BCheckBox v-model="hasRepetition" :label="t('calendar.form.repeat')" />
        <div class=" w-full mt-3">
            <BInput v-model="repetitionStart.value" :color="repetitionStart.color" :message="repetitionStart.message"
                :title="t('calendar.form.startDate')" type="date" :placeholder="t('general.select')" />
            <BInput :readonly="repetitionType === 'custom'" @select="selectOption"
                :type="repetitionType === 'custom' ? 'text' : 'number'"
                :maxlength="repetitionType === 'custom' ? undefined : 2" :options="repetitionTypes"
                v-model="repeatTimeCycle.value" :color="repeatTimeCycle.color" :message="repeatTimeCycle.message"
                :title="t('calendar.form.repeatEvery')" :placeholder="t('general.write')" />
            <div class=" w-full flex justify-between items-center transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap text-wrap"
                :class="[repetitionType === 'custom' ? ' h-auto opacity-100' : ' opacity-0 h-0']">
                <div @click="addSelection(day.dayOfWeek)" v-for="(day, index) in getWeekDayNames"
                    class=" cursor-pointer w-9 aspect-square  transition-all duration-200 ease-in-out rounded-full flex  items-center justify-center"
                    :class="[isSelected(day.dayOfWeek) ? ' border-outline-variant/0 bg-diamond-black dark:bg-diamond-gray border-0' : ' border border-outline-variant']">
                    <div class="  text-label-md select-none  "
                        :class="[isSelected(day.dayOfWeek) ? ' text-on-primary' : ' text-on-surface/50']"> {{
                            day.label }}</div>
                </div>
            </div>
            <div class=" py-4">
                <BCheckBox mode="switch" v-model="wholeDay" :label="t('calendar.form.wholeDay')" />
            </div>
            <BInput :title="t('calendar.form.hour')" v-model="chosenTime.value" :color="chosenTime.color"
                :message="chosenTime.message" preset="time" />
            <div class="pb-4">
                <BCheckBox mode="switch" v-model="isReminder" :label="t('calendar.form.remind')" />
            </div>
            <div class=" w-full  transition-all duration-200 ease-in-out  whitespace-nowrap text-wrap"
                :class="[isReminder ? ' h-auto opacity-100 overflow-visible' : ' opacity-0 h-0 overflow-hidden']">
                <BSelect :options="reminderOptions" v-model="selectedReminder.value" :color="selectedReminder.color"
                    :message="selectedReminder.message" :placeholder="t('general.select')"
                    :title="t('calendar.form.remindingTime')" />
            </div>
            <BSelect :title="t('calendar.form.repeatEnding.title')" :placeholder="t('general.select')"
                :options="repetitionEndTypes" v-model="repeatitionEnd.value" :color="repeatitionEnd.color"
                :message="repeatitionEnd.message" />
            <BInput :maxlength="endingDetailsProps.type === 'date' ? undefined : 3" v-model="repetitionAmount.value"
                :color="repetitionAmount.color" :message="repetitionAmount.message" :title="endingDetailsProps.title"
                :placeholder="endingDetailsProps.placeholder" :type="endingDetailsProps.type" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, nextTick, computed } from 'vue';
import { useI18n } from '#imports';
import type { MenuOption } from '~/types/components/menu-options';
import { useCalendarDate } from '~/composables/calendar/useCalendarDate';
import type { DropdownOption } from '~/types/components/select';
type RepetitionTypes = 'day' | 'hour' | 'custom'
export default defineComponent({
    name: 'EventRepetition',
    setup() {
        const { getWeekDayNames } = useCalendarDate()
        const { t } = useI18n()
        const hasRepetition = ref(false)
        const wholeDay = ref(false)
        const repetitionStart = ref({ value: '', color: 'primary', message: '' })
        const repeatTimeCycle = ref({ value: '', color: 'primary', message: '' })
        const chosenTime = ref({ value: '', color: 'primary', message: '' })
        const selectedDays = ref<number[]>([])
        const isReminder = ref(false)
        const repeatitionEnd = ref({ value: 'date', color: 'primary', message: '' })
        const repetitionAmount = ref({ value: 'date', color: 'primary', message: '' })

        const selectedReminder = ref({ value: 15, color: 'primary', message: '' });

        const reminderOptions = computed<DropdownOption[]>(() => {
            const m = t('general.timeframes.minutes');
            const h = t('general.timeframes.hours');

            return [
                { val: 5, unit: m, raw: 5 },
                { val: 10, unit: m, raw: 10 },
                { val: 15, unit: m, raw: 15 },
                { val: 30, unit: m, raw: 30 },
                { val: 1, unit: h, raw: 60 },
                { val: 2, unit: h, raw: 120 },
            ].map(opt => ({
                label: t('calendar.form.reminderOption', { time: opt.val, unit: opt.unit }),
                value: opt.raw
            }));
        });


        const repetitionEndTypes = computed<DropdownOption[]>(() => [
            {
                label: t('calendar.form.repeatEnding.date'),
                value: 'date'
            },
            {
                label: t('calendar.form.repeatEnding.times'),
                value: 'times'
            }
        ])

        const repetitionTypes = computed<MenuOption[]>(() => [
            {
                key: 'day',
                label: t('calendar.form.repetition.day'),
            },
            {
                key: 'hour',
                label: t('calendar.form.repetition.hour'),
            },
            {
                key: 'custom',
                label: t('calendar.form.repetition.custom'),
            },
        ])

        const endingDetailsProps = computed(() => {
            if (repeatitionEnd.value.value === 'date') return { placeholder: t('general.select'), title: t('calendar.form.repeatEnding.date'), type: 'date' }
            return { placeholder: t('general.write'), title: t('calendar.form.repeatEnding.times'), type: 'number' }
        })


        const repetitionType = ref<RepetitionTypes>(repetitionTypes.value[0]?.key)


        const selectOption = (key: RepetitionTypes) => {
            repetitionType.value = key;

        }

        const isSelected = (dayOfWeek: number) => {
            return selectedDays.value.includes(dayOfWeek);
        }

        const addSelection = (dayOfWeek: number) => {
            const index = selectedDays.value.indexOf(dayOfWeek);
            if (index > -1) selectedDays.value.splice(index, 1);
            else selectedDays.value.push(dayOfWeek);
        }

        watch(selectedDays, () => {
            if (repetitionType.value === 'custom') {
                repeatTimeCycle.value.value = selectedDaysLabels.value;
            }
        }, { deep: true });

        const selectedDaysLabels = computed(() => {
            return getWeekDayNames.value
                .filter(day => selectedDays.value.includes(day.dayOfWeek))
                .map(day => day.fullName)
                .join(' , ');
        });

        watch(repetitionType, (newVal) => {
            if (newVal !== 'custom') {
                selectedDays.value = [];
            }
            nextTick(() => {
                repeatTimeCycle.value.value = ''
                repetitionAmount.value.value = ''
            })
        });

        return {
            t,
            repetitionStart,
            hasRepetition,
            repetitionTypes,
            selectedReminder,
            chosenTime,
            repetitionAmount,
            repetitionType,
            endingDetailsProps,
            reminderOptions,
            repetitionEndTypes,
            repeatTimeCycle,
            wholeDay,
            isSelected,
            isReminder,
            addSelection,
            repeatitionEnd,
            selectOption,
            getWeekDayNames,
        }
    }
})
</script>