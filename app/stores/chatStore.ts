import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Message, Contact, FilterKeys } from "~/types/chat";
import { useWindowSize } from "~/composables/useWindowSize";
export const useChatStore = defineStore("chat", () => {
  const { height: windowHeight } = useWindowSize();

  // 2. Dynamic Calculation based on screen height
  const chatsPerPage = computed(() => {
    const h = windowHeight.value || 800; // Fallback for initial SSR load
    return Math.floor((h - 138) / 76) + 1;
  });
  // --- STATE ---
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
    "": { data: [], loading: false, page: 1, hasNextPage: true },
    online: { data: [], loading: false, page: 1, hasNextPage: true },
    ended: { data: [], loading: false, page: 1, hasNextPage: true },
    active: { data: [], loading: false, page: 1, hasNextPage: true },
  });

  // --- MOCK DATA GENERATORS ---
  const generateManyMockContacts = (
    filter: FilterKeys,
    page: number,
    pageSize: number,
  ): Contact[] => {
    const myId = 99;
    const now = new Date();

    // 1. Explicitly type the pool as Contact[] to solve the TS error
    const basePool: Contact[] = [
      {
        id: 1,
        name: "امیر",
        lastName: "سعیدی",
        isOnline: true,
        lastSeen: now,
        imageUrl: "https://i.pravatar.cc/150?u=1",
        isActive: true,
        unreadCount: 2,
        serviceType: "chat",
        lastMessage: {
          id: 101,
          conversationId: 1,
          date: new Date(now.getTime() - 1000 * 60 * 5),
          type: "text",
          text: "سلام، وقت بخیر؟",
          senderId: 1,
          isEdited: false,
          isSent: true,
          isRead: false,
        },
      },
      // ... (add your other 6 base contacts here, ensuring they all match the Contact interface exactly)
    ];

    const largePool: Contact[] = [];
    for (let i = 0; i < 70; i++) {
const template = basePool[i % basePool.length];
    const uniqueId = i + 1;
    const messageDate = new Date(now.getTime() - Math.floor(Math.random() * 10000) * 60000);

    // Explicitly mapping every property to satisfy the strict Contact type
    // and bypass the spread operator inference bug causing the 500 error.
    largePool.push({
      id: uniqueId,
      name: `${template.name} ${uniqueId}`,
      lastName: template.lastName,
      isOnline: template.isOnline,
      lastSeen: template.lastSeen,
      imageUrl: template.imageUrl,
      isActive: template.isActive,
      unreadCount: template.unreadCount,
      serviceType: template.serviceType,
      lastMessage: template.lastMessage
        ? {
            id: 10000 + uniqueId,
            conversationId: uniqueId,
            date: messageDate,
            type: template.lastMessage.type,
            text: template.lastMessage.text,
            imageUrl: template.lastMessage.imageUrl,
            fileUrl: template.lastMessage.fileUrl,
            voiceUrl: template.lastMessage.voiceUrl,
            isEdited: template.lastMessage.isEdited,
            senderId: template.lastMessage.senderId,
            isSent: template.lastMessage.isSent,
            isRead: template.lastMessage.isRead,
          }
        : undefined,
    });

    let filtered = largePool;
    if (filter === "online") filtered = largePool.filter((c) => c.isOnline);
    if (filter === "active") filtered = largePool.filter((c) => c.isActive);
    if (filter === "ended") filtered = largePool.filter((c) => !c.isActive);

    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  };

  // --- ACTIONS ---

  // Fetch the list of people you are chatting with
  const fetchConversations = async (
    filter: FilterKeys = "",
    page: number = 1,
  ) => {
    const state = conversationStates.value[filter];
    if (state.loading) return;

    state.loading = true;
    try {
      await new Promise((r) => setTimeout(r, page === 1 ? 1000 : 500));

      // Call the generator with the dynamic page size
      const newData = generateManyMockContacts(
        filter,
        page,
        chatsPerPage.value,
      );

      if (page === 1) {
        state.data = newData;
      } else {
        state.data = [...state.data, ...newData];
      }

      state.page = page;
      state.hasNextPage = newData.length >= chatsPerPage.value;
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

  /**
   * Returns data or skeletons based on the current screen height
   */
  const getDisplayedContacts = (filter: FilterKeys) => {
    const state = conversationStates.value[filter];

    // 3. CRITICAL: Skeletons must have the required Contact properties to prevent crashes
    if (state.loading && state.page === 1) {
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
          }) as Contact,
      );
    }

    return [...state.data].sort((a, b) => {
      const dateA = a.lastMessage?.date.getTime() || 0;
      const dateB = b.lastMessage?.date.getTime() || 0;
      return dateB - dateA;
    });
  };
  return {
    conversationStates,
    activeConversationId,
    fetchConversations,
    loadNextPage,
    getDisplayedContacts,
    chatsPerPage,
    messagesMap,
  };
});
