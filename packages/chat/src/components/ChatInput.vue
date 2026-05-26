<template>
  <div class="behayand-chat-input" v-if="isActive">
    <div v-if="replyingTo || editingMessage" class="action-bar">
      <span class="action-label">
        {{ editingMessage ? t("editing") : t("replyingTo") }}
      </span>
      <span class="action-text">{{ (editingMessage || replyingTo)?.text }}</span>
      <button class="cancel-btn" @click="cancelAction">×</button>
    </div>
    <div class="input-row">
      <button v-if="adapter?.uploadFile" class="attach-btn" @click="triggerFileInput">
        📎
      </button>
      <input type="file" ref="fileInput" class="hidden-input" @change="handleFileSelect" />
      <textarea
        ref="textareaRef"
        v-model="messageText"
        :placeholder="t('typeMessage')"
        class="message-textarea"
        rows="1"
        @keydown.enter.exact.prevent="sendMessage"
        @input="autoResize"
      ></textarea>
      <button class="send-btn" @click="sendMessage" :disabled="!canSend">
        ➤
      </button>
    </div>
  </div>
  <div v-else class="behayand-chat-input-disabled">
    <span>{{ t("chatEnded") }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, nextTick } from "vue";
import { useChatStore } from "../stores/chatStore";
import { useChatActionStore } from "../stores/chatActionStore";
import type { Message } from "../types";
import { TranslationsKey, type TranslationFn } from "../i18n";

export default defineComponent({
  name: "ChatInput",
  props: {
    conversationId: { type: Number, default: undefined },
    isActive: { type: Boolean, default: true },
  },
  emits: ["messageSent"],
  setup(props, { emit }) {
    const chatStore = useChatStore();
    const actionStore = useChatActionStore();
    const t = inject(TranslationsKey)!;

    const messageText = ref("");
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    const adapter = computed(() => chatStore.adapter);
    const replyingTo = computed(() => actionStore.replyingTo);
    const editingMessage = computed(() => actionStore.editingMessage);
    const canSend = computed(() => messageText.value.trim().length > 0);

    const cancelAction = () => actionStore.cancelAction();

    const autoResize = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = "auto";
        textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
      }
    };

    const sendMessage = async () => {
      if (!canSend.value || !props.conversationId || !adapter.value) return;

      const text = messageText.value.trim();
      messageText.value = "";
      nextTick(autoResize);

      if (editingMessage.value) {
        await adapter.value.editMessage(editingMessage.value.id, text);
        actionStore.cancelAction();
        return;
      }

      const user = adapter.value.getCurrentUser();
      const newMessage: Message = {
        id: Date.now(),
        conversationId: props.conversationId,
        date: new Date(),
        type: "text",
        text,
        isEdited: false,
        senderId: user.id,
        isSent: false,
        isRead: false,
        repliedTo: replyingTo.value || undefined,
      };

      actionStore.cancelAction();
      const sent = await adapter.value.sendMessages([newMessage]);
      if (sent.length > 0) {
        chatStore.updateLastMessage(props.conversationId, sent[0]);
        emit("messageSent", sent[0]);
      }
    };

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleFileSelect = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file || !adapter.value?.uploadFile || !props.conversationId) return;

      const url = await adapter.value.uploadFile(file);
      const user = adapter.value.getCurrentUser();
      const fileMessage: Message = {
        id: Date.now(),
        conversationId: props.conversationId,
        date: new Date(),
        type: "file",
        fileUrl: url,
        isEdited: false,
        senderId: user.id,
        isSent: false,
        isRead: false,
      };
      const sent = await adapter.value.sendMessages([fileMessage]);
      if (sent.length > 0) {
        chatStore.updateLastMessage(props.conversationId, sent[0]);
        emit("messageSent", sent[0]);
      }
      target.value = "";
    };

    const focus = () => {
      textareaRef.value?.focus();
    };

    return {
      adapter,
      messageText,
      textareaRef,
      fileInput,
      replyingTo,
      editingMessage,
      canSend,
      cancelAction,
      autoResize,
      sendMessage,
      triggerFileInput,
      handleFileSelect,
      focus,
      t,
    };
  },
});
</script>
