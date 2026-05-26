<template>
  <div class="behayand-chat-contact-list">
    <div class="search-bar">
      <input
        v-model="searchText"
        type="text"
        :placeholder="t('searchPlaceholder')"
        class="search-input"
        @input="handleSearch"
      />
    </div>
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter.key"
        class="filter-btn"
        :class="{ active: activeFilter === filter.key }"
        @click="setFilter(filter.key)"
      >
        {{ filter.label }}
      </button>
    </div>
    <div class="contact-list" ref="listRef" @scroll="handleScroll">
      <ChatContactItem
        v-for="contact in chats"
        :key="contact.id"
        :contact="contact"
        :is-active="contact.id === chatStore.activeConversationId"
        @select="selectContact"
      />
      <div v-if="currentState.loading" class="loading-indicator">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, inject } from "vue";
import { useChatStore } from "../stores/chatStore";
import type { FilterKeys, ChatFilter, Contact } from "../types";
import ChatContactItem from "./ChatContactItem.vue";
import { TranslationsKey, type TranslationFn } from "../i18n";

export default defineComponent({
  name: "ChatContactList",
  components: { ChatContactItem },
  setup() {
    const chatStore = useChatStore();
    const t = inject(TranslationsKey)!;
    const activeFilter = ref<FilterKeys>("");
    const searchText = ref("");
    const listRef = ref<HTMLElement | null>(null);

    const currentState = computed(() => chatStore.conversationStates[activeFilter.value]);
    const chats = computed(() => chatStore.getDisplayedContacts(activeFilter.value));

    const filters = computed<ChatFilter[]>(() => [
      { key: "online", label: t("filterOnline") },
      { key: "ended", label: t("filterEnded") },
      { key: "active", label: t("filterActive") },
    ]);

    const setFilter = (key: FilterKeys) => {
      if (activeFilter.value === key) {
        activeFilter.value = "";
      } else {
        activeFilter.value = key;
      }
    };

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleSearch = () => {
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        chatStore.fetchConversations(activeFilter.value, 1, searchText.value);
      }, 300);
    };

    const handleScroll = () => {
      if (!listRef.value) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.value;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        chatStore.loadNextPage(activeFilter.value);
      }
    };

    const selectContact = (contact: Contact) => {
      chatStore.setActiveConversation(contact.id);
    };

    watch(activeFilter, (newFilter) => {
      if (chatStore.conversationStates[newFilter].data.length === 0) {
        chatStore.fetchConversations(newFilter, 1, searchText.value);
      }
    });

    onMounted(() => {
      chatStore.fetchConversations("", 1);
    });

    return {
      chatStore,
      activeFilter,
      searchText,
      listRef,
      currentState,
      chats,
      filters,
      setFilter,
      handleSearch,
      handleScroll,
      selectContact,
      t,
    };
  },
});
</script>
