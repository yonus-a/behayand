<template>
    <div class="bg-surface flex flex-col border border-outline-variant w-full h-full">
        <ChatListSearch v-model="searchText" />

        <div class="flex-1 w-full flex flex-col overflow-hidden">
            <div class="w-full shrink-0 px-5 py-2 flex items-center gap-x-2">
                <BLabel class="cursor-pointer" size="lg" :text="filter.label" @action="setFilter('')"
                    :color="filterProps(filter.key).color" v-for="filter in filters"
                    :icon="filterProps(filter.key).icon" :key="filter.key" @click="setFilter(filter.key)" />
            </div>

            <div class="w-full flex-1 p-2.5">
                <BVirtualVerticalList ref="listRef" :items="chats" :loading="currentState.loading"
                    :has-next-page="currentState.hasNextPage" @load-more="chatStore.loadNextPage(activeFilter)">
                    <template #item="{ item }">
                        <ChatContactDisplay :contact="item"
                            :loading="currentState.loading && currentState.page === 1" />
                    </template>
                </BVirtualVerticalList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useChatStore, useI18n } from '#imports';
import type { ChatFilter, FilterKeys } from '~/types/chat';
import ChatContactDisplay from './ChatContactDisplay.vue';
import ChatListSearch from './ChatListSearch.vue';

export default defineComponent({
    name: 'ChatList',
    components: {
        ChatContactDisplay,
        ChatListSearch,
    },
    setup() {
        const { t } = useI18n();
        const chatStore = useChatStore();
        const activeFilter = ref<FilterKeys>('');
        const searchText = ref('');
        const listRef = ref(null);

        const currentState = computed(() => chatStore.conversationStates[activeFilter.value]);
        const chats = computed(() => chatStore.getDisplayedContacts(activeFilter.value));

        const filters = computed<ChatFilter[]>(() => [
            { key: 'online', label: t('chat.filters.online') },
            { key: 'ended', label: t('chat.filters.ended') },
            { key: 'active', label: t('chat.filters.active') },
        ]);

        const setFilter = (type: FilterKeys) => {
            if (activeFilter.value === type) return;
            activeFilter.value = type;
        };

        // Handle Filter Changes
        watch(activeFilter, (newFilter) => {
            // 1. Scroll to top (Assuming Virtual List has a scroll div)
            const scrollEl = listRef.value?.$el;
            if (scrollEl) scrollEl.scrollTop = 0;

            // 2. Fetch if category is empty
            if (chatStore.conversationStates[newFilter].data.length === 0) {
                chatStore.fetchConversations(newFilter, 1);
            }
        });

        onMounted(() => {
            chatStore.fetchConversations('', 1);
        });

        const filterProps = (type: FilterKeys) => {
            return activeFilter.value === type
                ? { color: 'primary', icon: 'PhX' }
                : { color: 'neutral', icon: '' };
        };

        return {
            setFilter,
            t,
            filterProps,
            filters,
            chats,
            activeFilter,
            currentState,
            searchText,
            listRef,
            chatStore
        };
    }
})
</script>