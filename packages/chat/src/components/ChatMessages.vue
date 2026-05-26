<template>
  <div class="behayand-chat-messages" ref="messagesContainer" @scroll="handleScroll">
    <div v-if="loading" class="loading-top">
      <div class="spinner"></div>
    </div>
    <ChatBubble
      v-for="msg in extendedMessages"
      :key="msg.id"
      :message="msg"
      :current-user="currentUser"
      @scroll-to-message="scrollToMessage"
    />
    <div ref="bottomAnchor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, nextTick, type PropType } from "vue";
import type { Message, ExtendedMessage, Contact, CurrentUser } from "../types";
import type { ChatDataAdapter } from "../adapter/types";
import ChatBubble from "./ChatBubble.vue";
import { useChatStore } from "../stores/chatStore";

export default defineComponent({
  name: "ChatMessages",
  components: { ChatBubble },
  props: {
    conversationId: { type: Number, required: true },
    contact: { type: Object as PropType<Contact>, default: null },
  },
  setup(props) {
    const chatStore = useChatStore();
    const messagesContainer = ref<HTMLElement | null>(null);
    const bottomAnchor = ref<HTMLElement | null>(null);
    const messages = ref<Message[]>([]);
    const loading = ref(false);
    const page = ref(1);
    const hasNextPage = ref(true);

    const currentUser = computed<CurrentUser>(() => {
      if (chatStore.adapter) {
        return chatStore.adapter.getCurrentUser();
      }
      return { id: 0, name: "", lastName: "" };
    });

    const extendedMessages = computed<ExtendedMessage[]>(() => {
      return messages.value.map((msg, i) => {
        const prev = i > 0 ? messages.value[i - 1] : undefined;
        const isFirstInDate =
          !prev ||
          new Date(msg.date).toDateString() !== new Date(prev.date).toDateString();
        return {
          ...msg,
          prevMessage: prev,
          nextMessage: messages.value[i + 1],
          isFirstInDate,
          contact: props.contact || undefined,
        };
      });
    });

    const fetchMessages = async (pageNum: number) => {
      if (!chatStore.adapter || loading.value) return;
      loading.value = true;
      try {
        const result = await chatStore.adapter.fetchMessages(
          props.conversationId,
          pageNum,
          20,
        );
        if (pageNum === 1) {
          messages.value = result.data;
        } else {
          messages.value = [...result.data, ...messages.value];
        }
        hasNextPage.value = result.hasNextPage;
        page.value = pageNum;
      } finally {
        loading.value = false;
      }
    };

    const handleScroll = () => {
      if (!messagesContainer.value) return;
      if (messagesContainer.value.scrollTop < 50 && hasNextPage.value && !loading.value) {
        fetchMessages(page.value + 1);
      }
    };

    const scrollToBottom = () => {
      nextTick(() => {
        bottomAnchor.value?.scrollIntoView({ behavior: "smooth" });
      });
    };

    const scrollToMessage = (messageId: number) => {
      const el = messagesContainer.value?.querySelector(`[data-message-id="${messageId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    watch(
      () => props.conversationId,
      (newId) => {
        if (newId) {
          messages.value = [];
          page.value = 1;
          hasNextPage.value = true;
          fetchMessages(1).then(scrollToBottom);
        }
      },
      { immediate: true },
    );

    return {
      messagesContainer,
      bottomAnchor,
      messages,
      loading,
      extendedMessages,
      currentUser,
      handleScroll,
      scrollToMessage,
    };
  },
});
</script>
