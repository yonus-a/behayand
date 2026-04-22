<template>
    <div class="flex w-full h-full">
        <div class="h-full flex-1 relative">
            <NuxtPage />
        </div>
        
        <div class="w-80 h-full shrink-0 border-l border-outline-variant">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n, useSeoMeta } from '#imports';
import ChatList from '~/components/chat/ChatList.vue';

definePageMeta({
    layout: 'dashboard' // Keeps your Sidebar perfectly intact
})

export default defineComponent({
    name: 'ChatWrapper',
    setup() {
        const { t } = useI18n()

        useSeoMeta({
            title: () => t('seo.dashboard.chat.title'),
            description: () => t('seo.dashboard.chat.description'),
            ogTitle: () => `${t('seo.siteName')} - ${t('seo.dashboard.chat.title')}`,
        });

        return {}
    }
})
</script>