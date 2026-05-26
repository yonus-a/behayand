import type {
  Contact,
  CurrentUser,
  FilterKeys,
  Message,
  PaginatedContacts,
  PaginatedMessages,
} from "../types";

/**
 * ChatDataAdapter interface.
 * Implement this interface to connect the chat UI to your backend.
 */
export interface ChatDataAdapter {
  /** Returns the current authenticated user info. */
  getCurrentUser(): CurrentUser;

  /** Fetch a paginated list of conversations (contacts). */
  fetchConversations(
    filter: FilterKeys,
    page: number,
    pageSize: number,
    search?: string,
  ): Promise<PaginatedContacts>;

  /** Fetch paginated messages for a specific conversation. */
  fetchMessages(
    conversationId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedMessages>;

  /** Send one or more messages to a conversation. */
  sendMessages(messages: Message[]): Promise<Message[]>;

  /** Edit a message's text content. */
  editMessage(messageId: number, newText: string): Promise<Message>;

  /** Delete one or more messages. */
  deleteMessages(messageIds: number[]): Promise<void>;

  /** Mark a conversation as read. */
  markAsRead(conversationId: number): Promise<void>;

  /** Fetch contact details by ID. */
  getContactById(contactId: number): Promise<Contact | null>;

  /** Upload a file and return the URL. Optional. */
  uploadFile?(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<string>;
}
