<template>
    <div class=" w-full px-8 border-b h-17.25 border-b-outline/50 flex items-center justify-end gap-x-4">
        <div class=" flex items-center h-full gap-x-3">
            <div class=" h-13 overflow-hidden">
                <BInput v-model="searchText" @submit="initSearch" icon="PhMagnifyingGlass"
                    :placeholder="t('general.search')" />
            </div>
            <BButton icon="PhPlus" />
        </div>
        <NuxtLinkLocale to="/dashboard/chat">
            <BButton type="ghost" icon="PhChatText" />
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/dashboard/calendar/reminder">
            <BButton type="ghost" icon="PhCalendarDots" />
        </NuxtLinkLocale>
        <div class=" w-10 h-10 flex items-center justify-center cursor-pointer relative">
            <div
                class=" rounded-full w-6 h-4.5 text-white select-none bg-gradient-error flex justify-center items-center absolute z-10 ltr:left-0 rtl:right-0 top-0">
                <div class=" text-label-sm">1</div>
            </div>
            <BIcon icon="PhBell" class=" w-5 h-5  fill-primary" />
        </div>
        <div class=" w-10 aspect-square flex justify-center items-center">
            <div class=" cursor-pointer w-5 h-5 rounded-full overflow-hidden">
                <BImage class=" w-full h-full min-w-full min-h-full max-w-full max-h-full" :src="profileStore.userData.imageUrl"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from '#imports';
import { useProfileStore } from '#imports';
export default defineComponent({
    name: 'DashboardHeader',
    setup() {
        const profileStore = useProfileStore()
        const { t } = useI18n()
        const searchText = ref('')

        const initSearch = () => {

        }


        return {
            t,
            searchText,
            initSearch,
            profileStore,
        }
    }
})
</script>