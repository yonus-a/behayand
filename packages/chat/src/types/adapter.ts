import type {
  Message,
  Contact,
  ChatFilter,
  FilterKeys,
  Request,
} from "./chat";

/**
 * ChatDataAdapter - The main abstraction for data fetching.
 *
 * Implement this interface to connect the chat module to your backend API.
 * All methods return Promises to support async data fetching.
 *
 * @example
 * ```typescript
 * const myAdapter: ChatDataAdapter = {
 *   async fetchConversations(filter, page, search) {
 *     const res = await api.get('/conversations', { params: { filter, page, search } });
 *     return { contacts: res.data.items, hasMore: res.data.hasMore };
 *   },
 *   // ... implement other methods
 * };
 * ```
 */
export interface ChatDataAdapter {
  // ─── Conversations ──────────────────────────────────────────────────────────

  /**
   * Fetch paginated conversations with optional filtering and search
   */
  fetchConversations(
    filter: FilterKeys,
    page: number,
    search?: string,
  ): Promise<{ contacts: Contact[]; hasMore: boolean }>;

  // ─── Messages ───────────────────────────────────────────────────────────────

  /**
   * Fetch paginated messages for a specific conversation
   */
  fetchMessages(
    conversationId: number,
    page: number,
  ): Promise<{ messages: Message[]; hasMore: boolean }>;

  // ─── Actions ────────────────────────────────────────────────────────────────

  /**
   * Send one or more messages. Returns the server-confirmed messages with real IDs.
   */
  sendMessage(
    conversationId: number,
    messages: Partial<Message>[],
  ): Promise<Message[]>;

  /**
   * Edit a message's text. Returns the updated message.
   */
  editMessage(messageId: number, newText: string): Promise<Message>;

  /**
   * Delete one or more messages by their IDs.
   */
  deleteMessages(messageIds: number[]): Promise<void>;

  /**
   * Mark all messages in a conversation as read.
   */
  markAsRead(conversationId: number): Promise<void>;

  // ─── File Handling ──────────────────────────────────────────────────────────

  /**
   * Upload a file with progress callback. Returns the file URL on success.
   */
  uploadFile(
    file: File,
    onProgress?: (percentage: number) => void,
  ): Promise<string>;

  /**
   * Download a file by URL. Returns the Blob.
   */
  downloadFile(url: string): Promise<Blob>;

  // ─── Requests (Optional - Medical/Service specific) ─────────────────────────

  /**
   * Send a service request (e.g., add provider, specialist consultation).
   * Optional - only needed for medical/service workflows.
   */
  sendServiceRequest?(
    conversationId: number,
    serviceId: number,
    serviceLabel: string,
    providers: Array<{ id: number; name?: string; lastName?: string }>,
  ): Promise<Message>;

  /**
   * Send a personal info access request.
   * Optional - only needed for medical/service workflows.
   */
  sendPersonalInfoRequest?(conversationId: number): Promise<Message>;

  /**
   * Handle access response (approve/reject a personal info request).
   * Optional - only needed for medical/service workflows.
   */
  handleAccessResponse?(
    messageId: number,
    conversationId: number,
    action: "confirm-access" | "reject-access",
    currentRequest: Request,
  ): Promise<Message>;

  // ─── Prescription (Optional) ────────────────────────────────────────────────

  /**
   * Send a prescription to a patient.
   */
  sendPrescription?(
    conversationId: number,
    medications: Array<{
      name: string;
      brand?: string;
      dosage?: string;
      repetition?: string;
      usageMethod?: string;
    }>,
  ): Promise<void>;

  /**
   * Send a patient referral.
   */
  sendReferral?(
    conversationId: number,
    referral: {
      speciality: string;
      priority: "high" | "medium" | "low";
      description?: string;
    },
  ): Promise<void>;

  /**
   * Send a hospitalization request.
   */
  sendHospitalization?(
    conversationId: number,
    data: {
      priority: "high" | "medium" | "low";
      period?: string;
      description?: string;
    },
  ): Promise<void>;

  // ─── Services Data (Optional) ───────────────────────────────────────────────

  /**
   * Fetch available services list (for service request creation).
   */
  fetchServices?(): Promise<
    Array<{ id: number; label: string; icon?: string }>
  >;

  /**
   * Fetch available providers/medics for a service.
   */
  fetchProviders?(
    serviceId?: number,
    search?: string,
  ): Promise<
    Array<{
      id: number;
      name: string;
      lastName: string;
      imageUrl?: string;
      expertise?: string;
      fellowship?: string;
    }>
  >;

  /**
   * Search medications by name.
   */
  searchMedications?(
    query: string,
  ): Promise<
    Array<{
      id: number;
      name: string;
      nameEn?: string;
      brands?: Array<{ id: number; name: string }>;
    }>
  >;
}
