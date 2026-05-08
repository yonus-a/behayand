<template>
    <div class=" w-full h-full max-h-full flex flex-col">
        <CalendarHeader @add="openEventPopup" @refresh="refreshCalendar" @share="openSharePopup"
            @update:mode="handleModeUpdate" @update:range="handleRangeUpdate" />
        <div class=" w-full overflow-hidden flex-1 ">
            <CalendarGrid :range="currentRange" :mode="currentMode" />
        </div>
        <SharePopup ref="sharePopup" />
        <MainPopup ref="eventPopup" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useI18n, useSeoMeta, useCalendarStore } from '#imports';
import CalendarHeader from '~/components/calendar/CalendarHeader.vue';
import CalendarGrid from '~/components/calendar/grid/CalendarGrid.vue';
import SharePopup from '~/components/calendar/SharePopup.vue';
import type { Popup } from '~/types/components/popup';
import MainPopup from '~/components/calendar/event-management/MainPopup.vue';
definePageMeta({
    layout: 'dashboard',
    title: 'seo.dashboard.calendar.title'
})

export default defineComponent({
    name: 'CalendarPage',
    components: {
        MainPopup,
        CalendarHeader,
        CalendarGrid,
        SharePopup,
    },
    setup() {
        const { t } = useI18n()
        const calendarStore = useCalendarStore()

        const eventPopup = ref<Popup | null>(null)
        const sharePopup = ref<Popup | null>(null)


        const currentRange = ref<{ start: Date; end: Date } | null>(null);
        const currentMode = ref('monthly')


        const handleRangeUpdate = (range: { start: Date; end: Date }) => {
            currentRange.value = range;
            console.log('New Range Received:', {
                start: range.start.toLocaleString(),
                end: range.end.toLocaleString()
            });
        };

        const refreshCalendar = () => {
            calendarStore.refreshData()
        }

        const handleModeUpdate = (mode: 'daily' | 'weekly' | 'monthly') => {
            currentMode.value = mode
        }

        const openSharePopup = () => {
            sharePopup.value?.open()
        }


        onMounted(() => {
            openEventPopup()
        })

        useSeoMeta({
            title: () => t('seo.dashboard.calendar.title'),
            description: () => t('seo.dashboard.calendar.description'),
            ogTitle: () => `${t('seo.siteName')} - ${t('seo.dashboard.calendar.title')}`,
        });


        const openEventPopup = () => {
            eventPopup.value?.open()
        }


        return {
            handleModeUpdate,
            handleRangeUpdate,
            currentMode,
            openSharePopup,
            refreshCalendar,
            openEventPopup,
            sharePopup,
            t,
            eventPopup,
            currentRange,
        }
    }
})

</script>