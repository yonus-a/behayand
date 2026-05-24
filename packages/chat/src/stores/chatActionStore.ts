import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ExtendedMessage, Message } from "../types/chat";
import { useEventBus } from "@vueuse/core";
import { useChatStore } from "./chatStore";

export const useChatActionStore = defineStore("chatAction", () => {
  const chatStore = useChatStore();

  // ─── Configuration ────────────────────────────────────────────────────────

  /** The current user's ID - must be set via setUserId() */
  const currentUserId = ref<number>(0);

  const setUserId = (id: number) => {
    currentUserId.value = id;
  };

  // ─── Upload Progress ──────────────────────────────────────────────────────

  const uploadProgress = ref<
    Map<number, { progress: number; uploaded: number; total: number }>
  >(new Map());

  const processingActions = ref(new Map<number, string>());

  const isActionBusy = (messageId: number, actionKey: string) => {
    return processingActions.value.get(messageId) === actionKey;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  const isSelectMode = ref(false);
  const selectedMessages = ref<Map<number, ExtendedMessage>>(new Map());
  const isMenuOpen = ref(false);
  const replyingTo = ref<ExtendedMessage | null>(null);
  const editingMessage = ref<ExtendedMessage | null>(null);
  const editWindowHours = ref(6);

  // ─── Event Buses ──────────────────────────────────────────────────────────

  const deleteBus = useEventBus<number[]>("chat-delete");
  const sendBus = useEventBus<Message[]>("chat-send");
  const editBus = useEventBus<ExtendedMessage>("edit-message");
  const personalInfoBus = useEventBus<number>("personal-info-request");
  const prescriptionBus = useEventBus<number>("prescription");
  const updateBus = useEventBus<{ id: number; updates: Partial<Message> }>(
    "chat-update",
  );

  /** Emitted when the chat wants to show a notification */
  const toastBus = useEventBus<{ message: string; type: "success" | "error" | "info" }>(
    "chat-toast",
  );

  /** Emitted when navigation is needed (e.g., selecting a conversation) */
  const navigationBus = useEventBus<{ action: string; payload?: any }>(
    "chat-navigation",
  );

  // ─── Getters ──────────────────────────────────────────────────────────────

  const selectedArray = computed(() =>
    Array.from(selectedMessages.value.values()),
  );

  const canReply = computed(() => selectedMessages.value.size <= 1);

  const canEdit = computed(() => {
    if (selectedMessages.value.size !== 1) return false;
    const msg = selectedArray.value[0];
    if (!msg) return false;
    const isMine = msg.senderId === currentUserId.value;
    const hoursPassed =
      (Date.now() - new Date(msg.date).getTime()) / (1000 * 60 * 60);
    return isMine && hoursPassed < editWindowHours.value;
  });

  const canDelete = computed(() => {
    if (selectedMessages.value.size === 0) return false;
    return selectedArray.value.every((msg) => {
      const isMine = msg.senderId === currentUserId.value;
      const hoursPassed =
        (Date.now() - new Date(msg.date).getTime()) / (1000 * 60 * 60);
      return isMine && hoursPassed < editWindowHours.value;
    });
  });

  // ─── Actions ──────────────────────────────────────────────────────────────

  const triggerPersonalInfoRequest = (conversationId: number) => {
    personalInfoBus.emit(conversationId);
  };

  const triggerPrescription = (conversationId: number) => {
    prescriptionBus.emit(conversationId);
  };

  const triggerDelete = async (specificIds?: number[]) => {
    const targets = specificIds?.length
      ? specificIds
      : selectedArray.value.map((m) => m.id);
    if (targets.length === 0) return;

    targets.forEach((id) => processingActions.value.set(id, "cancel-request"));
    deleteBus.emit(targets);
    clearActions();

    try {
      const adapter = chatStore.getAdapter();
      await adapter.deleteMessages(targets);
    } catch (e) {
      console.error("[@yonus-a/chat] delete failed:", e);
    }

    targets.forEach((id) => processingActions.value.delete(id));
  };

  const handleRemoteAction = async (
    messageId: number,
    actionKey: string,
    apiCall: () => Promise<void>,
  ) => {
    processingActions.value.set(messageId, actionKey);
    try {
      await apiCall();
    } finally {
      processingActions.value.delete(messageId);
    }
  };

  const sendMessage = async (messages: Message[]) => {
    const tempMessages = messages.map((m) => ({
      ...m,
      id: Math.floor(Math.random() * -1000000),
      isSent: false,
    }));

    sendBus.emit(tempMessages);

    if (tempMessages.length > 0) {
      const latest = tempMessages[tempMessages.length - 1];
      chatStore.updateLastMessage(latest.conversationId, latest);
    }

    // Upload via adapter
    const adapter = chatStore.getAdapter();

    for (const tempMsg of tempMessages) {
      try {
        // Track upload progress for non-text messages
        if (tempMsg.type !== "text") {
          uploadProgress.value.set(tempMsg.id, {
            progress: 0,
            uploaded: 0,
            total: 100,
          });
        }

        const [confirmedMessage] = await adapter.sendMessage(
          tempMsg.conversationId,
          [tempMsg],
        );

        // Clear upload progress
        uploadProgress.value.delete(tempMsg.id);

        // Update with real ID from server
        if (confirmedMessage) {
          updateBus.emit({
            id: tempMsg.id,
            updates: { id: confirmedMessage.id, isSent: true },
          });
          chatStore.patchLastMessage(tempMsg.conversationId, tempMsg.id, {
            id: confirmedMessage.id,
            isSent: true,
          });
        }
      } catch (e) {
        console.error("[@yonus-a/chat] sendMessage failed:", e);
        uploadProgress.value.delete(tempMsg.id);
        toastBus.emit({ message: "Failed to send message", type: "error" });
      }
    }
  };

  const saveEditMessage = async (id: number, text: string) => {
    const conversationId = editingMessage.value?.conversationId;

    // Optimistic update
    updateBus.emit({ id, updates: { text, isSent: false } });
    if (conversationId)
      chatStore.patchLastMessage(conversationId, id, { text, isSent: false });

    clearActions();

    try {
      const adapter = chatStore.getAdapter();
      await adapter.editMessage(id, text);

      updateBus.emit({ id, updates: { isSent: true, isEdited: true } });
      if (conversationId)
        chatStore.patchLastMessage(conversationId, id, {
          isSent: true,
          isEdited: true,
        });
    } catch (e) {
      console.error("[@yonus-a/chat] editMessage failed:", e);
      toastBus.emit({ message: "Failed to edit message", type: "error" });
    }
  };

  const triggerEdit = (message: ExtendedMessage) => {
    editingMessage.value = message;
    editBus.emit(editingMessage.value);
  };

  const toggleSelection = (message: ExtendedMessage) => {
    const newMap = new Map(selectedMessages.value);
    if (newMap.has(message.id)) {
      newMap.delete(message.id);
      if (newMap.size === 0) isSelectMode.value = false;
    } else {
      newMap.set(message.id, message);
    }
    selectedMessages.value = newMap;
  };

  const startSelectMode = (message: ExtendedMessage) => {
    isSelectMode.value = true;
    const newMap = new Map();
    newMap.set(message.id, message);
    selectedMessages.value = newMap;
  };

  const clearActions = () => {
    isSelectMode.value = false;
    selectedMessages.value.clear();
    replyingTo.value = null;
    editingMessage.value = null;
  };

  const copyMessageText = (
    formatDateShort?: (date: Date) => string,
    formatTime?: (date: Date) => string,
  ) => {
    const textToCopy = selectedArray.value
      .map((msg) => {
        const isMine = msg.senderId === currentUserId.value;
        const senderName = isMine ? "You" : msg.contact?.name || "User";
        const dateStr = formatDateShort
          ? `${formatDateShort(msg.date)}, ${formatTime?.(msg.date) || ""}`
          : new Date(msg.date).toLocaleString();
        const content =
          msg.text ||
          (msg.imageUrl ? "[Image]" : msg.voiceUrl ? "[Voice]" : "[File]");
        return `${senderName} [${dateStr}]:\n${content}`;
      })
      .join("\n\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      toastBus.emit({ message: "Message copied", type: "success" });
    });
    clearActions();
  };

  const sendServiceRequest = async (
    conversationId: number,
    serviceId: number,
    serviceLabel: string,
    selectedProviders: Array<{ id: number; name?: string; lastName?: string }>,
  ) => {
    const adapter = chatStore.getAdapter();
    if (!adapter.sendServiceRequest) {
      console.warn("[@yonus-a/chat] sendServiceRequest not implemented in adapter");
      return;
    }

    try {
      const message = await adapter.sendServiceRequest(
        conversationId,
        serviceId,
        serviceLabel,
        selectedProviders,
      );
      sendBus.emit([message]);
      chatStore.updateLastMessage(conversationId, message);
    } catch (e) {
      console.error("[@yonus-a/chat] sendServiceRequest failed:", e);
      toastBus.emit({ message: "Failed to send service request", type: "error" });
    }
  };

  const sendPersonalInfoRequest = async (conversationId: number) => {
    const adapter = chatStore.getAdapter();
    if (!adapter.sendPersonalInfoRequest) {
      console.warn("[@yonus-a/chat] sendPersonalInfoRequest not implemented in adapter");
      return;
    }

    try {
      const message = await adapter.sendPersonalInfoRequest(conversationId);
      sendBus.emit([message]);
      chatStore.updateLastMessage(conversationId, message);
    } catch (e) {
      console.error("[@yonus-a/chat] sendPersonalInfoRequest failed:", e);
      toastBus.emit({ message: "Failed to send request", type: "error" });
    }
  };

  const handleAccessResponse = async (
    messageId: number,
    conversationId: number,
    key: "confirm-access" | "reject-access",
    currentRequest: any,
  ) => {
    processingActions.value.set(messageId, key);

    try {
      const adapter = chatStore.getAdapter();
      if (!adapter.handleAccessResponse) {
        // Fallback: optimistic update only
        const targetStatus = key === "confirm-access" ? "approved" : "rejected";
        const updatedRequest = {
          ...currentRequest,
          request: { ...currentRequest.request, status: targetStatus },
        };
        updateBus.emit({ id: messageId, updates: { request: updatedRequest } });
        chatStore.patchLastMessage(conversationId, messageId, {
          request: updatedRequest,
        });
        return;
      }

      const updatedMessage = await adapter.handleAccessResponse(
        messageId,
        conversationId,
        key,
        currentRequest,
      );
      updateBus.emit({
        id: messageId,
        updates: { request: updatedMessage.request },
      });
      chatStore.patchLastMessage(conversationId, messageId, {
        request: updatedMessage.request,
      });
    } catch (e) {
      console.error("[@yonus-a/chat] handleAccessResponse failed:", e);
    } finally {
      processingActions.value.delete(messageId);
    }
  };

  return {
    // Config
    currentUserId,
    setUserId,

    // State
    isSelectMode,
    selectedMessages,
    isMenuOpen,
    replyingTo,
    editingMessage,
    editWindowHours,
    uploadProgress,
    processingActions,

    // Getters
    selectedArray,
    canReply,
    canEdit,
    canDelete,
    isActionBusy,

    // Event Buses
    deleteBus,
    sendBus,
    updateBus,
    editBus,
    personalInfoBus,
    prescriptionBus,
    toastBus,
    navigationBus,

    // Actions
    triggerDelete,
    sendMessage,
    saveEditMessage,
    triggerEdit,
    toggleSelection,
    startSelectMode,
    clearActions,
    copyMessageText,
    sendServiceRequest,
    sendPersonalInfoRequest,
    triggerPersonalInfoRequest,
    triggerPrescription,
    handleRemoteAction,
    handleAccessResponse,
  };
});
