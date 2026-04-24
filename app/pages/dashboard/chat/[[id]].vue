<template>
    <div class="  w-full bg-surface-variant h-full">
        <div class=" h-full w-full flex">
            <ChatProfileOverview :profile="selectedChat" />
            <div class=" flex flex-1 flex-col justify-between items-center h-full" v-show="chatId">
                <div class=" w-full bg-surface h-20">
                    <ChatPageBar @open-profile="openProfile" :contact="selectedChat" />
                </div>

                <ChatInput ref="chatInput" :is-active="selectedChat?.isActive" />
            </div>
        </div>
        <div v-show="!chatId" class=" w-full h-full flex items-center justify-center">
            <NoDataDisplay :image-path="NoChatSelected" :title="t('chat.noConversationSelected')" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n, useSeoMeta } from '#imports';
import ChatPageBar from '~/components/chat/ChatPageBar.vue';
import ChatList from '~/components/chat/ChatList.vue';
import { useRoute, useRouter } from 'vue-router';
import ChatInput from '~/components/chat/ChatInput.vue';
import NoDataDisplay from '~/components/general/NoDataDisplay.vue';
import NoChatSelected from '/images/dashboard/no-chat-selected.webp';
import { useChatStore } from '#imports';
import { type ChatTextField } from '~/types/components/chat-input';
import ChatProfileOverview from '~/components/chat/ChatProfileOverview.vue';
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
        ChatProfileOverview,
    },
    setup() {
        const chatStore = useChatStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n()
        const chatInput = ref<ChatTextField | null>(null)

        const chatId = computed(() => {
            const id = route.params.id;
            return id ? parseInt(id as string) : null;
        });

        watch(() => route.params.id, () => {
            console.log('fuck')
            if (chatId.value && selectedChat.value?.isActive) {
                nextTick(() => {
                    console.log(chatInput.value)
                    chatInput.value?.focus()
                })
            }
        })

        const selectedChat = computed(() => {
            if (!chatId.value) return null;
            return chatStore.getContactById(chatId.value);
        });



        useSeoMeta({
            title: () => t('seo.dashboard.chat.title'),
            description: () => t('seo.dashboard.chat.description'),
            ogTitle: () => `${t('seo.siteName')} - ${t('seo.dashboard.chat.title')}`,
        });

        const openProfile = () => {
            router.push({ query: { ...route.query, view: 'profile' } })
        }

        return {
            t,
            chatId,
            NoChatSelected,
            chatInput,
            openProfile,
            selectedChat,
        }
    }
})
</script>