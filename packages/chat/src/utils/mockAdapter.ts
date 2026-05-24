import type { ChatDataAdapter } from "../types/adapter";
import type { Message, Contact, FilterKeys } from "../types/chat";

/**
 * Creates a mock adapter for testing and development purposes.
 * Simulates API delays and generates mock data.
 *
 * @example
 * ```typescript
 * import { createChat, createMockAdapter } from '@yonus-a/chat'
 *
 * const chat = createChat({
 *   adapter: createMockAdapter(),
 *   userId: 99,
 * })
 * ```
 */
export function createMockAdapter(options?: {
  /** Simulated delay in ms (default: 500) */
  delay?: number;
  /** Number of contacts to generate (default: 30) */
  contactCount?: number;
  /** Number of messages per conversation (default: 20) */
  messagesPerConversation?: number;
}): ChatDataAdapter {
  const delay = options?.delay ?? 500;
  const contactCount = options?.contactCount ?? 30;
  const messagesPerPage = options?.messagesPerConversation ?? 20;

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Generate mock contacts
  const generateContacts = (count: number): Contact[] => {
    const names = [
      "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry",
      "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Peter",
    ];
    const lastNames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
      "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas",
    ];

    const now = new Date();
    return Array.from({ length: count }, (_, i) => {
      const id = i + 1;
      const name = names[i % names.length];
      const lastName = lastNames[i % lastNames.length];
      const messageDate = new Date(
        now.getTime() - Math.floor(Math.random() * 10000) * 60000,
      );

      return {
        id,
        name: `${name}`,
        lastName,
        isOnline: Math.random() > 0.6,
        lastSeen: new Date(now.getTime() - Math.random() * 86400000),
        imageUrl: `https://i.pravatar.cc/150?u=${id}`,
        isActive: Math.random() > 0.3,
        birthDate: new Date(
          now.getFullYear() - Math.floor(Math.random() * 32 + 18),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        phoneNumber: `0913${Math.floor(Math.random() * 9000000 + 1000000)}`,
        nationalCode: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5 + 1) : 0,
        serviceType: ["chat", "voice-call", "video-call"][
          Math.floor(Math.random() * 3)
        ] as Contact["serviceType"],
        lastMessage: {
          id: 10000 + id,
          conversationId: id,
          date: messageDate,
          type: "text" as const,
          text: [
            "Hello! How are you?",
            "See you tomorrow",
            "Thanks for the update",
            "Got it, will check",
            "Can we discuss later?",
          ][Math.floor(Math.random() * 5)],
          isEdited: false,
          senderId: Math.random() > 0.5 ? 99 : id,
          isSent: true,
          isRead: Math.random() > 0.4,
        },
      };
    });
  };

  const allContacts = generateContacts(contactCount);

  // Generate mock messages for a conversation
  const generateMessages = (
    conversationId: number,
    page: number,
  ): Message[] => {
    const now = new Date();
    const pageOffset = (page - 1) * messagesPerPage;

    return Array.from({ length: messagesPerPage }, (_, i) => {
      const index = pageOffset + i;
      const minutesAgo = (messagesPerPage * 3 - index) * 5 + Math.random() * 3;
      const types: Message["type"][] = ["text", "text", "text", "text", "image"];
      const type = types[Math.floor(Math.random() * types.length)];

      return {
        id: conversationId * 10000 + index + 1,
        conversationId,
        date: new Date(now.getTime() - minutesAgo * 60000),
        type,
        text:
          type === "text"
            ? [
                "Hello there!",
                "How are you doing?",
                "I'll send you the document soon.",
                "Perfect, thanks!",
                "Let me check and get back to you.",
                "Sure, no problem.",
                "When is the meeting?",
                "I'll be there at 3pm.",
              ][Math.floor(Math.random() * 8)]
            : undefined,
        imageUrl:
          type === "image"
            ? [`https://picsum.photos/300/200?random=${index}`]
            : undefined,
        isEdited: Math.random() > 0.9,
        senderId: Math.random() > 0.5 ? 99 : conversationId,
        isSent: true,
        isRead: Math.random() > 0.3,
      };
    });
  };

  return {
    async fetchConversations(
      filter: FilterKeys,
      page: number,
      search?: string,
    ) {
      await wait(page === 1 ? delay : delay / 2);

      let filtered = [...allContacts];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q),
        );
      }

      if (filter === "online") filtered = filtered.filter((c) => c.isOnline);
      if (filter === "active") filtered = filtered.filter((c) => c.isActive);
      if (filter === "ended") filtered = filtered.filter((c) => !c.isActive);

      const pageSize = 12;
      const start = (page - 1) * pageSize;
      const contacts = filtered.slice(start, start + pageSize);

      return {
        contacts,
        hasMore: start + pageSize < filtered.length,
      };
    },

    async fetchMessages(conversationId: number, page: number) {
      await wait(delay);
      const messages = generateMessages(conversationId, page);
      return {
        messages,
        hasMore: page < 3,
      };
    },

    async sendMessage(conversationId: number, messages: Partial<Message>[]) {
      await wait(delay);
      return messages.map((m, i) => ({
        ...m,
        id: Math.floor(Math.random() * 100000) + 1000,
        conversationId,
        date: new Date(),
        isSent: true,
        isRead: false,
        isEdited: false,
        senderId: 99,
        type: m.type || "text",
      })) as Message[];
    },

    async editMessage(messageId: number, newText: string) {
      await wait(delay);
      return {
        id: messageId,
        text: newText,
        isEdited: true,
        isSent: true,
      } as Message;
    },

    async deleteMessages(messageIds: number[]) {
      await wait(delay);
    },

    async markAsRead(conversationId: number) {
      await wait(100);
    },

    async uploadFile(file: File, onProgress?: (pct: number) => void) {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await wait(200);
        onProgress?.(i);
      }
      return `https://example.com/uploads/${file.name}`;
    },

    async downloadFile(url: string) {
      await wait(delay);
      return new Blob(["mock file content"], {
        type: "application/octet-stream",
      });
    },
  };
}
