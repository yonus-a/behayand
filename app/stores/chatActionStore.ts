import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useProfileStore } from "#imports";
import type { ExtendedMessage } from "~/types/chat";

export const useChatActionStore = defineStore("chatAction", () => {
  const profileStore = useProfileStore();

  // --- State ---
  const isSelectMode = ref(false);
  const selectedMessages = ref<Map<number, ExtendedMessage>>(new Map());
  const isMenuOpen = ref(false);
  const replyingTo = ref<ExtendedMessage | null>(null);
  const editingMessage = ref<ExtendedMessage | null>(null);
  const editWindowHours = ref(6);

  // --- Getters (Computed) ---
  const selectedArray = computed(() =>
    Array.from(selectedMessages.value.values()),
  );

  const canReply = computed(() => selectedMessages.value.size <= 1);

  const canEdit = computed(() => {
    if (selectedMessages.value.size > 1) return false;
    const msg = selectedArray.value;
    if (!msg) return false;

    const isMine = msg.senderId === profileStore.userData.id;
    const hoursPassed =
      (Date.now() - new Date(msg.date).getTime()) / (1000 * 60 * 60);
    return isMine && hoursPassed < editWindowHours.value;
  });

  const canDelete = computed(() => {
    if (selectedMessages.value.size === 0) return false;

    return selectedArray.value.every((msg) => {
      const isMine = msg.senderId === profileStore.userData.id;
      const hoursPassed =
        (Date.now() - new Date(msg.date).getTime()) / (1000 * 60 * 60);
      return isMine && hoursPassed < editWindowHours.value;
    });
  });

  // --- Actions ---
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
    selectedMessages.value = new Map();
    replyingTo.value = null;
    editingMessage.value = null;
  };

  return {
    isSelectMode,
    selectedMessages,
    isMenuOpen,
    replyingTo,
    editingMessage,
    editWindowHours,
    selectedArray,
    canReply,
    canEdit,
    canDelete,
    toggleSelection,
    startSelectMode,
    clearActions,
  };
});
