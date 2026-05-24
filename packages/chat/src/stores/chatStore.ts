import { defineStore } from "pinia";
import { ref, computed, inject } from "vue";
import type { Message, Contact, FilterKeys } from "../types/chat";
import type { ChatDataAdapter } from "../types/adapter";
import { CHAT_ADAPTER_KEY } from "../composables/useChat";

export const useChatStore = defineStore("chat", () => {
  // ─── Configuration ────────────────────────────────────────────────────────

  const chatsPerPage = ref(12);

  /**
   * Update chats per page based on container height.
   * Call this from your layout to dynamically adjust pagination.
   */
  const updateChatsPerPage = (containerHeight: number) => {
    chatsPerPage.value = Math.floor((containerHeight - 138) / 76) + 1;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  const activeConversationId = ref<number | null>(null);
  const messagesMap = ref<Record<number, Message[]>>({});

  const conversationStates = ref<
    Record<
      FilterKeys,
      {
        data: Contact[];
        loading: boolean;
        page: number;
        hasNextPage: boolean;
      }
    >
  >({
    "": { data: [], loading: false, page: 0, hasNextPage: true },
    online: { data: [], loading: false, page: 0, hasNextPage: true },
    ended: { data: [], loading: false, page: 0, hasNextPage: true },
    active: { data: [], loading: false, page: 0, hasNextPage: true },
  });

  // ─── Adapter Access ───────────────────────────────────────────────────────

  let _adapter: ChatDataAdapter | null = null;

  const setAdapter = (adapter: ChatDataAdapter) => {
    _adapter = adapter;
  };

  const getAdapter = (): ChatDataAdapter => {
    if (!_adapter) {
      throw new Error(
        "[@yonus-a/chat] No adapter configured. Call setAdapter() or provide an adapter via createChat().",
      );
    }
    return _adapter;
  };

  // ─── Actions ──────────────────────────────────────────────────────────────

  const fetchConversations = async (
    filter: FilterKeys = "",
    page: number = 1,
    search: string = "",
  ) => {
    const state = conversationStates.value[filter];
    if (state.loading) return;

    state.loading = true;
    try {
      const adapter = getAdapter();
      const { contacts, hasMore } = await adapter.fetchConversations(
        filter,
        page,
        search,
      );

      if (page === 1) state.data = contacts;
      else state.data = [...state.data, ...contacts];

      state.page = page;
      state.hasNextPage = hasMore;
    } finally {
      state.loading = false;
    }
  };

  const loadNextPage = async (filter: FilterKeys) => {
    const state = conversationStates.value[filter];
    if (state.hasNextPage && !state.loading) {
      await fetchConversations(filter, state.page + 1);
    }
  };

  const getDisplayedContacts = (filter: FilterKeys) => {
    const state = conversationStates.value[filter];

    // Show skeletons only if we haven't successfully loaded the first page yet
    if (state.loading && state.page === 0) {
      return Array.from(
        { length: chatsPerPage.value },
        (_, i) =>
          ({
            id: -i - 1,
            name: "",
            lastName: "",
            imageUrl: "",
            isOnline: false,
            lastSeen: new Date(),
            isActive: true,
            unreadCount: 0,
            serviceType: "chat",
            lastMessage: {
              id: -1,
              conversationId: -i - 1,
              date: new Date(),
              type: "text",
              text: "",
              isEdited: false,
              senderId: -1,
              isSent: true,
              isRead: true,
            },
          }) as Contact,
      );
    }

    // Sort by date descending (newest first)
    return [...state.data].sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.date).getTime() : 0;
      const dateB = b.lastMessage ? new Date(b.lastMessage.date).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getContactById = (id: number): Contact | null => {
    for (const key in conversationStates.value) {
      const contact = conversationStates.value[key as FilterKeys].data.find(
        (c) => c.id === id,
      );
      if (contact) return contact;
    }
    return null;
  };

  const markAsRead = async (conversationId: number) => {
    // Optimistic update
    for (const key in conversationStates.value) {
      const contact = conversationStates.value[key as FilterKeys].data.find(
        (c) => c.id === conversationId,
      );
      if (contact) {
        contact.unreadCount = 0;
        if (contact.lastMessage) {
          contact.lastMessage.isRead = true;
        }
      }
    }

    // Call adapter
    try {
      const adapter = getAdapter();
      await adapter.markAsRead(conversationId);
    } catch (e) {
      console.error("[@yonus-a/chat] markAsRead failed:", e);
    }
  };

  const updateLastMessage = (conversationId: number, message: Message) => {
    for (const key in conversationStates.value) {
      const state = conversationStates.value[key as FilterKeys];
      const contact = state.data.find((c) => c.id === conversationId);
      if (contact) {
        contact.lastMessage = { ...message };
      }
    }
  };

  const patchLastMessage = (
    conversationId: number,
    messageId: number,
    updates: Partial<Message>,
  ) => {
    for (const key in conversationStates.value) {
      const contact = conversationStates.value[key as FilterKeys].data.find(
        (c) => c.id === conversationId,
      );
      if (
        contact &&
        contact.lastMessage &&
        contact.lastMessage.id === messageId
      ) {
        contact.lastMessage = { ...contact.lastMessage, ...updates };
      }
    }
  };

  const unreadCount = computed(() => {
    const uniqueContacts = new Map<number, Contact>();

    for (const key in conversationStates.value) {
      const state = conversationStates.value[key as FilterKeys];
      state.data.forEach((contact) => {
        if (!uniqueContacts.has(contact.id)) {
          uniqueContacts.set(contact.id, contact);
        }
      });
    }

    return Array.from(uniqueContacts.values()).filter((contact) => {
      return contact.lastMessage && contact.lastMessage.isRead === false;
    }).length;
  });

  return {
    // Config
    chatsPerPage,
    updateChatsPerPage,
    setAdapter,
    getAdapter,

    // State
    conversationStates,
    activeConversationId,
    messagesMap,

    // Actions
    fetchConversations,
    loadNextPage,
    getDisplayedContacts,
    getContactById,
    markAsRead,
    updateLastMessage,
    patchLastMessage,

    // Computed
    unreadCount,
  };
});
