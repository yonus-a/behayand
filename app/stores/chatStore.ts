import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Message, Contact, FilterKeys } from "~/types/chat";
import { useWindowSize } from "~/composables/useWindowSize";

export const useChatStore = defineStore("chat", () => {
  const { height: windowHeight } = useWindowSize();

  // Dynamic Calculation based on screen height
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
    "": { data: [], loading: false, page: 0, hasNextPage: true },
    online: { data: [], loading: false, page: 0, hasNextPage: true },
    ended: { data: [], loading: false, page: 0, hasNextPage: true },
    active: { data: [], loading: false, page: 0, hasNextPage: true },
  });

  // --- MOCK DATA GENERATORS ---
  const generateManyMockContacts = (
    filter: FilterKeys,
    page: number,
    pageSize: number,
    search: string = "",
  ): Contact[] => {
    const myId = 99;
    const now = new Date();

    const basePool: Contact[] = [
      {
        id: 1,
        name: "امیر",
        lastName: "سعیدی",
        isOnline: true,
        lastSeen: now,
        imageUrl: "https://i.pravatar.cc/150?u=1",
        isActive: false,
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
      // Adding a second fallback so array math works properly
      {
        id: 2,
        name: "سارا",
        lastName: "احمدی",
        isOnline: false,
        lastSeen: new Date(now.getTime() - 3600000),
        imageUrl: "https://i.pravatar.cc/150?u=2",
        isActive: true,
        unreadCount: 0,
        serviceType: "video-call",
        lastMessage: {
          id: 102,
          conversationId: 2,
          date: new Date(now.getTime() - 1000 * 3600 * 2),
          type: "text",
          text: "بله، فایل رو بررسی کردم.",
          senderId: myId,
          isEdited: false,
          isSent: true,
          isRead: true,
        },
      },
    ];

    const largePool: Contact[] = [];

    // --- THE LOOP ---
    for (let i = 0; i < 70; i++) {
      // FIX 1: 'as Contact' strips away the strict 'undefined' TS error.
      const template = basePool[i % basePool.length] as Contact;
      const uniqueId = i + 1;
      const messageDate = new Date(
        now.getTime() - Math.floor(Math.random() * 10000) * 60000,
      );

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
    } // FIX 2: Loop securely closed here!

    // --- FILTER & RETURN OUTSIDE THE LOOP ---
    let filtered = largePool;
    if (search) {
      const query = search.toLowerCase();
      filtered = largePool.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.lastName.toLowerCase().includes(query),
      );
    }

    if (filter === "online") filtered = largePool.filter((c) => c.isOnline);
    if (filter === "active") filtered = largePool.filter((c) => c.isActive);
    if (filter === "ended") filtered = largePool.filter((c) => !c.isActive);

    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  };

  // --- ACTIONS ---

  const fetchConversations = async (
    filter: FilterKeys = "",
    page: number = 1,
    search: string = "", // Add this parameter
  ) => {
    const state = conversationStates.value[filter];
    if (state.loading) return;

    state.loading = true;
    try {
      await new Promise((r) => setTimeout(r, page === 1 ? 800 : 400));

      // Pass the search query to the generator
      const newData = generateManyMockContacts(
        filter,
        page,
        chatsPerPage.value,
        search, // Pass it down
      );

      if (page === 1) state.data = newData;
      else state.data = [...state.data, ...newData];

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

  const getDisplayedContacts = (filter: FilterKeys) => {
    const state = conversationStates.value[filter];

    // Show skeletons only if we haven't successfully loaded the first page yet
    if (state.loading && state.page === 0) {
      return Array.from(
        { length: chatsPerPage.value },
        (_, i) =>
          ({
            id: -i - 1,
            name: "در حال", // "Loading"
            lastName: "بارگذاری...", // "Loading..."
            imageUrl: "https://i.pravatar.cc/150?u=loading", // Static placeholder image
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
              text: "در حال بارگذاری پیام...", // "Loading message..."
              isEdited: false,
              senderId: -1,
              isSent: true,
              isRead: true,
            },
          }) as Contact,
      );
    }
    return state.data;
  };

  const getContactById = (id: number): Contact | null => {
    // We check all categories because the user might have arrived
    // via the "Online" list or the "All" list.
    for (const key in conversationStates.value) {
      const contact = conversationStates.value[key as FilterKeys].data.find(
        (c) => c.id === id,
      );
      if (contact) return contact;
    }
    return null;
  };

  return {
    conversationStates,
    activeConversationId,
    fetchConversations,
    loadNextPage,
    getDisplayedContacts,
    chatsPerPage,
    getContactById,
    messagesMap,
  };
});
