import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useProfileStore } from "#imports";
import type { ExtendedMessage } from "~/types/chat";
import { useDate, useI18n, useAppToast } from "#imports";
import { useEventBus } from "@vueuse/core";

export const useChatActionStore = defineStore("chatAction", () => {
  const profileStore = useProfileStore();
  const { t } = useI18n();
  const { openToast } = useAppToast();
  const { formatDateShort, formatTime } = useDate();
  // --- State ---
  const isSelectMode = ref(false);
  const selectedMessages = ref<Map<number, ExtendedMessage>>(new Map());
  const isMenuOpen = ref(false);
  const replyingTo = ref<ExtendedMessage | null>(null);
  const editingMessage = ref<ExtendedMessage | null>(null);
  const editWindowHours = ref(6);

  const deleteBus = useEventBus<number[]>("chat-delete");
  const editBus = useEventBus<{ id: number; text: string }>("chat-edit");
  const replyBus = useEventBus<{ text: string; repliedTo: any }>("chat-reply");

  const triggerDelete = () => {
    const targets = selectedArray.value;
    if (targets.length === 0) return;
    deleteBus.emit(targets.map((target) => target.id));
  };

  // --- Getters (Computed) ---
  const selectedArray = computed(() =>
    Array.from(selectedMessages.value.values()),
  );

  const canReply = computed(() => selectedMessages.value.size <= 1);

  const canEdit = computed(() => {
    // 1. Must have exactly 1 message
    if (selectedMessages.value.size !== 1) return false;

    // 2. Access the FIRST element of the array
    const msg = selectedArray.value[0];
    if (!msg) return false;

    // 3. Perform the checks on the actual message object
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

  const copyMessageText = () => {
    const targets = selectedArray.value;
    const textToCopy = targets
      .map((msg) => {
        const isMine = msg.senderId === profileStore.userData.id;
        const senderName = isMine ? t("chat.you") : msg.contact?.name || "User";
        const dateTime = `${formatDateShort(msg.date)}, ${formatTime(msg.date)}`;
        const content =
          msg.text ||
          (msg.imageUrl ? "[Image]" : msg.voiceUrl ? "[Voice]" : "[File]");
        return `${senderName} [${dateTime}]:\n${content}`;
      })
      .join("\n\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      openToast(t("chat.copiedMessage"), "success");
    });
    clearActions();
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
    triggerDelete,
    copyMessageText,
    startSelectMode,
    clearActions,
    deleteBus,
  };
});
