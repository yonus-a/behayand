<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useChatStore } from "../stores/chatStore";
import { useChat } from "../composables/useChat";
import type { Contact, FilterKeys, ChatFilter } from "../types/chat";

const props = withDefaults(
  defineProps<{
    /** Currently active conversation ID */
    activeId?: number | null;
    /** Available filter options */
    filters?: ChatFilter[];
    /** Whether to show search */
    showSearch?: boolean;
    /** Debounce delay for search in ms */
    searchDebounce?: number;
  }>(),
  {
    showSearch: true,
    searchDebounce: 500,
  },
);

const emit = defineEmits<{
  (e: "select", contact: Contact): void;
  (e: "search", query: string): void;
}>();

const { t } = useChat();
const chatStore = useChatStore();

// ─── State ──────────────────────────────────────────────────────────────────

const activeFilter = ref<FilterKeys>("");
const searchQuery = ref("");
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

// ─── Computed ───────────────────────────────────────────────────────────────

const contacts = computed(() => chatStore.getDisplayedContacts(activeFilter.value));
const isLoading = computed(
  () => chatStore.conversationStates[activeFilter.value].loading,
);
const hasNextPage = computed(
  () => chatStore.conversationStates[activeFilter.value].hasNextPage,
);

const defaultFilters: ChatFilter[] = [
  { key: "", label: "All" },
  { key: "online", label: "Online" },
  { key: "active", label: "Active" },
  { key: "ended", label: "Ended" },
];

const availableFilters = computed(() => props.filters || defaultFilters);

// ─── Methods ────────────────────────────────────────────────────────────────

const setFilter = (filter: FilterKeys) => {
  activeFilter.value = filter;
  chatStore.fetchConversations(filter, 1, searchQuery.value);
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (searchTimeout.value) clearTimeout(searchTimeout.value);

  searchTimeout.value = setTimeout(() => {
    chatStore.fetchConversations(activeFilter.value, 1, query);
    emit("search", query);
  }, props.searchDebounce);
};

const loadMore = () => {
  chatStore.loadNextPage(activeFilter.value);
};

const selectContact = (contact: Contact) => {
  emit("select", contact);
};

// ─── Init ───────────────────────────────────────────────────────────────────

onMounted(() => {
  chatStore.fetchConversations(activeFilter.value, 1);
});
</script>

<template>
  <div class="chat-list">
    <!-- Search -->
    <div v-if="showSearch" class="chat-list__search">
      <slot name="search" :query="searchQuery" :on-search="handleSearch">
        <input
          type="text"
          :value="searchQuery"
          :placeholder="t('chat.search')"
          class="chat-list__search-input"
          @input="handleSearch(($event.target as HTMLInputElement).value)"
        />
      </slot>
    </div>

    <!-- Filters -->
    <div v-if="availableFilters.length > 1" class="chat-list__filters">
      <slot name="filters" :filters="availableFilters" :active="activeFilter" :set-filter="setFilter">
        <button
          v-for="filter in availableFilters"
          :key="filter.key"
          class="chat-list__filter-btn"
          :class="{ 'chat-list__filter-btn--active': activeFilter === filter.key }"
          @click="setFilter(filter.key)"
        >
          {{ filter.label }}
        </button>
      </slot>
    </div>

    <!-- Contact list -->
    <div class="chat-list__items">
      <slot
        :contacts="contacts"
        :loading="isLoading"
        :load-more="loadMore"
        :select="selectContact"
      >
        <div
          v-for="contact in contacts"
          :key="contact.id"
          class="chat-list__item"
          :class="{
            'chat-list__item--active': contact.id === activeId,
            'chat-list__item--skeleton': contact.id < 0,
          }"
          @click="selectContact(contact)"
        >
          <slot name="contact" :contact="contact">
            <!-- Default contact display -->
            <div class="chat-list__contact">
              <div class="chat-list__contact-avatar">
                <img
                  v-if="contact.imageUrl && contact.id > 0"
                  :src="contact.imageUrl"
                  :alt="contact.name"
                />
                <span v-else-if="contact.id > 0">
                  {{ contact.name?.charAt(0) }}
                </span>
                <div v-else class="chat-list__skeleton-circle" />
                <span v-if="contact.isOnline" class="chat-list__online-dot" />
              </div>
              <div class="chat-list__contact-info">
                <div class="chat-list__contact-header">
                  <span
                    v-if="contact.id > 0"
                    class="chat-list__contact-name"
                  >
                    {{ contact.name }} {{ contact.lastName }}
                  </span>
                  <div v-else class="chat-list__skeleton-text" />
                  <span
                    v-if="contact.lastMessage && contact.id > 0"
                    class="chat-list__contact-time"
                  >
                    {{ new Date(contact.lastMessage.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                  </span>
                </div>
                <div class="chat-list__contact-preview">
                  <span
                    v-if="contact.lastMessage?.text && contact.id > 0"
                    class="chat-list__contact-message"
                  >
                    {{ contact.lastMessage.text }}
                  </span>
                  <div v-else-if="contact.id < 0" class="chat-list__skeleton-text chat-list__skeleton-text--short" />
                  <span
                    v-if="contact.unreadCount && contact.unreadCount > 0"
                    class="chat-list__unread-badge"
                  >
                    {{ contact.unreadCount }}
                  </span>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </slot>

      <!-- Load more trigger -->
      <div
        v-if="hasNextPage && !isLoading"
        class="chat-list__load-more"
      >
        <slot name="load-more" :load-more="loadMore">
          <button class="chat-list__load-more-btn" @click="loadMore">
            {{ t('chat.loadMore') }}
          </button>
        </slot>
      </div>

      <!-- Loading -->
      <div v-if="isLoading && contacts.length > 0" class="chat-list__loading">
        <slot name="loading">
          <div class="chat-list__spinner" />
        </slot>
      </div>

      <!-- Empty state -->
      <div v-if="!isLoading && contacts.length === 0" class="chat-list__empty">
        <slot name="empty">
          <p>{{ t('chat.noConversations') }}</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-list__search {
  padding: 12px 16px;
}

.chat-list__search-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid var(--chat-outline-variant);
  background-color: var(--chat-surface-variant);
  color: var(--chat-on-surface);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-list__search-input:focus {
  border-color: var(--chat-primary);
}

.chat-list__search-input::placeholder {
  color: var(--chat-on-surface-secondary);
}

.chat-list__filters {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px;
  overflow-x: auto;
}

.chat-list__filter-btn {
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--chat-outline-variant);
  background: var(--chat-surface);
  color: var(--chat-on-surface-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.chat-list__filter-btn--active {
  background-color: var(--chat-primary);
  color: white;
  border-color: var(--chat-primary);
}

.chat-list__items {
  flex: 1;
  overflow-y: auto;
}

.chat-list__item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.chat-list__item:hover {
  background-color: var(--chat-surface-variant);
}

.chat-list__item--active {
  background-color: var(--chat-surface-variant-2);
}

.chat-list__contact {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-list__contact-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: visible;
}

.chat-list__contact-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.chat-list__contact-avatar span:first-child:not(.chat-list__online-dot) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--chat-surface-variant-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--chat-on-surface-secondary);
}

.chat-list__online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--chat-success);
  border: 2px solid var(--chat-surface);
}

.chat-list__contact-info {
  flex: 1;
  min-width: 0;
}

.chat-list__contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-list__contact-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--chat-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-list__contact-time {
  font-size: 0.7rem;
  color: var(--chat-on-surface-secondary);
  flex-shrink: 0;
}

.chat-list__contact-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-list__contact-message {
  font-size: 0.8rem;
  color: var(--chat-on-surface-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.chat-list__unread-badge {
  background-color: var(--chat-primary);
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

.chat-list__load-more {
  padding: 12px;
  display: flex;
  justify-content: center;
}

.chat-list__load-more-btn {
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid var(--chat-outline-variant);
  background: var(--chat-surface-variant);
  color: var(--chat-on-surface-secondary);
  cursor: pointer;
  font-size: 0.8rem;
}

.chat-list__loading {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.chat-list__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--chat-outline-variant);
  border-top-color: var(--chat-primary);
  border-radius: 50%;
  animation: chat-list-spin 0.8s linear infinite;
}

.chat-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: var(--chat-on-surface-secondary);
  font-size: 0.85rem;
}

/* Skeleton styles */
.chat-list__item--skeleton {
  pointer-events: none;
}

.chat-list__skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--chat-surface-variant) 25%, var(--chat-surface-variant-2) 50%, var(--chat-surface-variant) 75%);
  background-size: 200% 100%;
  animation: chat-skeleton-shimmer 1.5s infinite;
}

.chat-list__skeleton-text {
  height: 12px;
  width: 120px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--chat-surface-variant) 25%, var(--chat-surface-variant-2) 50%, var(--chat-surface-variant) 75%);
  background-size: 200% 100%;
  animation: chat-skeleton-shimmer 1.5s infinite;
}

.chat-list__skeleton-text--short {
  width: 80px;
}

@keyframes chat-list-spin {
  to { transform: rotate(360deg); }
}

@keyframes chat-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
