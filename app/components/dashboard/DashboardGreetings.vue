<template>
    <div class=" flex items-center gap-x-2 md:gap-x-6 w-full">
        <div class=" shrink-0 h-17 w-17 md:h-30 md:w-30">
            <BImage v-loading="isLoading" class=" w-full max-w-full max-h-full h-full min-w-full min-h-full"
                :src="greetingsImage" />
        </div>
        <div class=" flex-1 flex flex-col gap-y-2 md:gap-y-1.5">
            <div v-loading="isLoading">
                <i18n-t keypath="dashboard.greetings.hello" tag="span"
                    class="select-none text-title-md md:text-head-sm text-on-surface">
                    <template #name>
                        <span class="text-primary">{{ firstName }}</span>
                    </template>
                </i18n-t>
            </div>
            <div class=" flex items-center gap-x-3">
                <div v-loading="isLoading" class=" shrink-0 py-0.5 px-3  rounded-lg bg-primary/20">

                    <div class=" select-none text-label-sm md:text-label-md text-primary">{{
                        t('dashboard.greetings.imBehno') }}
                    </div>
                </div>
                <div v-loading="isHealthLoading">
                    <i18n-t keypath="dashboard.greetings.text" tag="span"
                        class="md:block hidden text-label-md select-none text-on-surface/50">
                        <template #state>
                            <span :class="[healthStateColor]">{{ healthState }}</span>
                        </template>
                    </i18n-t>
                </div>
            </div>
        </div>
        <div class=" md:flex shrink-0 h-full hidden items-center gap-x-2">
            <StoryDisplay v-for="story in allStories" :key="story.id" :story="story" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useProfileStore } from '~/stores/profileStore';
import greetingsImage from '/images/dashboard/greetings.webp'
import { useI18n } from '#imports';
import { useStoriesStore, useHealthStore } from '#imports';
import StoryDisplay from '../layout/dashboard/story/StoryDisplay.vue';
export default defineComponent({
    name: 'DashboardGreetings',
    components: {
        StoryDisplay,
    },
    setup() {
        const storiesStore = useStoriesStore()
        const { t } = useI18n()
        const healthStore = useHealthStore()
        const profileStore = useProfileStore()
        const firstName = computed(() => profileStore.userData.name)
        const isLoading = computed(() => profileStore.isLoading)
        const isHealthLoading = computed(() => healthStore.isGlobalLoading)
        const allStories = computed(() => storiesStore.stories)

        const healthState = computed(() => t(`dashboard.greetings.healthStates.${healthStore.overallStatus}`))

        const healthStateColor = computed(() => {
            if (healthStore.overallStatus === 'bad') return 'text-error'
            if (healthStore.overallStatus === 'medium') return 'text-warning'
            if (healthStore.overallStatus === 'good') return 'text-primary'
        })


        return {
            t,
            isLoading,
            greetingsImage,
            firstName,
            healthStateColor,
            healthState,
            allStories,
            isHealthLoading,
        }
    }
})
</script>