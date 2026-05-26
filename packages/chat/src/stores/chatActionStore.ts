import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ExtendedMessage, Message } from "../types";
import type { ChatDataAdapter } from "../adapter/types";
import { useChatStore } from "./chatStore";

export const useChatActionStore = defineStore("behayand-chat-action", () => {
  const chatStore = useChatStore();

  const uploadProgress = ref<
    Map<number, { progress: number; uploaded: number; total: number }>
  >(new Map());

  const processingActions = ref(new Map<number, string>());

  const isActionBusy = (messageId: number, actionKey: string) => {
    return processingActions.value.get(messageId) === actionKey;
  };

  // --- State ---
  const isSelectMode = ref(false);
  const selectedMessages = ref<Map<number, ExtendedMessage>>(new Map());
  const isMenuOpen = ref(false);
  const replyingTo = ref<ExtendedMessage | null>(null);
  const editingMessage = ref<ExtendedMessage | null>(null);
  const editWindowHours = ref(6);

  // --- Actions ---
  const toggleSelectMode = (force?: boolean) => {
    isSelectMode.value = force ?? !isSelectMode.value;
    if (!isSelectMode.value) {
      selectedMessages.value.clear();
    }
  };

  const toggleMessageSelection = (message: ExtendedMessage) => {
    if (selectedMessages.value.has(message.id)) {
      selectedMessages.value.delete(message.id);
    } else {
      selectedMessages.value.set(message.id, message);
    }
  };

  const setReplyTo = (message: ExtendedMessage | null) => {
    editingMessage.value = null;
    replyingTo.value = message;
  };

  const setEditing = (message: ExtendedMessage | null) => {
    replyingTo.value = null;
    editingMessage.value = message;
  };

  const cancelAction = () => {
    replyingTo.value = null;
    editingMessage.value = null;
  };

  const canEdit = (message: ExtendedMessage): boolean => {
    if (!chatStore.adapter) return false;
    const user = chatStore.adapter.getCurrentUser();
    if (message.senderId !== user.id) return false;
    const hoursDiff =
      (Date.now() - new Date(message.date).getTime()) / (1000 * 60 * 60);
    return hoursDiff <= editWindowHours.value;
  };

  const textMode = computed(() => {
    if (editingMessage.value) return "edit";
    if (replyingTo.value) return "reply";
    return "normal";
  });

  const deleteSelectedMessages = async () => {
    if (!chatStore.adapter || selectedMessages.value.size === 0) return;
    const ids = Array.from(selectedMessages.value.keys());
    processingActions.value.set(ids[0], "delete");
    try {
      await chatStore.adapter.deleteMessages(ids);
      selectedMessages.value.clear();
      toggleSelectMode(false);
    } finally {
      processingActions.value.delete(ids[0]);
    }
  };

  return {
    uploadProgress,
    processingActions,
    isActionBusy,
    isSelectMode,
    selectedMessages,
    isMenuOpen,
    replyingTo,
    editingMessage,
    editWindowHours,
    toggleSelectMode,
    toggleMessageSelection,
    setReplyTo,
    setEditing,
    cancelAction,
    canEdit,
    textMode,
    deleteSelectedMessages,
  };
});
