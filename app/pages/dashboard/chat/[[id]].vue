<template>
    <div class="  w-full bg-surface-variant h-full">
        <div class=" flex w-full flex-col justify-between items-center h-full" v-if="chatId">
            <ChatPageBar :contact="selectedChat" />

            <ChatInput :is-active="selectedChat?.isActive" />
        </div>
        <div v-else class=" w-full h-full flex items-center justify-center">
            <NoDataDisplay :image-path="NoChatSelected" :title="t('chat.noConversationSelected')" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n, useSeoMeta } from '#imports';
import ChatPageBar from '~/components/chat/ChatPageBar.vue';
import ChatList from '~/components/chat/ChatList.vue';
import { useRoute } from 'vue-router';
import ChatInput from '~/components/chat/ChatInput.vue';
import NoDataDisplay from '~/components/general/NoDataDisplay.vue';
import NoChatSelected from '/images/dashboard/no-chat-selected.webp';
import { useChatStore } from '#imports';
definePageMeta({
    layout: 'dashboard'
})

export default defineComponent({
    name: 'ChatPage',
    components: {
        ChatPageBar,
        ChatList,
        ChatInput,
        NoDataDisplay,
    },
    setup() {
        const chatStore = useChatStore()
        const route = useRoute()
        const { t } = useI18n()

        const chatId = computed(() => {
            const id = route.params.id;
            return id ? parseInt(id as string) : null;
        });

        const selectedChat = computed(() => {
            if (!chatId.value) return null;
            return chatStore.getContactById(chatId.value);
        });



        useSeoMeta({
            title: () => t('seo.dashboard.chat.title'),
            description: () => t('seo.dashboard.chat.description'),
            ogTitle: () => `${t('seo.siteName')} - ${t('seo.dashboard.chat.title')}`,
        });

        return {
            t,
            chatId,
            NoChatSelected,
            selectedChat,
        }
    }
})
</script>