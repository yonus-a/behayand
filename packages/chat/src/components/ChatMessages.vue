<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useChatStore } from "../stores/chatStore";
import { useChatActionStore } from "../stores/chatActionStore";
import { useChat } from "../composables/useChat";
import type { Message, ExtendedMessage, Contact } from "../types/chat";

const props = defineProps<{
  /** The active conversation ID to display messages for */
  conversationId: number;
  /** The contact for this conversation */
  contact?: Contact;
  /** Maximum pages to load (for pagination limits) */
  maxPages?: number;
}>();

const emit = defineEmits<{
  (e: "scroll-top"): void;
  (e: "message-click", message: ExtendedMessage): void;
}>();

const { adapter, userId } = useChat();
const chatStore = useChatStore();
const actionStore = useChatActionStore();

// ─── State ──────────────────────────────────────────────────────────────────

const messages = ref<Message[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMorePages = ref(true);
const maxPages = computed(() => props.maxPages || 5);

// ─── Extended Messages ──────────────────────────────────────────────────────

const extendedMessages = computed<ExtendedMessage[]>(() => {
  return messages.value.map((msg, index) => {
    const prev = index > 0 ? messages.value[index - 1] : undefined;
    const next =
      index < messages.value.length - 1
        ? messages.value[index + 1]
        : undefined;

    const isFirstInDate =
      !prev ||
      new Date(msg.date).toDateString() !== new Date(prev.date).toDateString();

    return {
      ...msg,
      prevMessage: prev,
      nextMessage: next,
      isFirstInDate,
      contact: props.contact,
    };
  });
});

// ─── Fetch Messages ─────────────────────────────────────────────────────────

const fetchMessages = async (page: number = 1) => {
  if (!adapter || loading.value) return;

  loading.value = true;
  try {
    const result = await adapter.fetchMessages(props.conversationId, page);
    if (page === 1) {
      messages.value = result.messages;
    } else {
      messages.value = [...result.messages, ...messages.value];
    }
    hasMorePages.value = result.hasMore;
    currentPage.value = page;
  } catch (e) {
    console.error("[@yonus-a/chat] fetchMessages failed:", e);
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (hasMorePages.value && currentPage.value < maxPages.value) {
    await fetchMessages(currentPage.value + 1);
    emit("scroll-top");
  }
};

// ─── Event Bus Listeners ────────────────────────────────────────────────────

const unsubSend = actionStore.sendBus.on((newMessages) => {
  const relevant = newMessages.filter(
    (m) => m.conversationId === props.conversationId,
  );
  if (relevant.length > 0) {
    messages.value = [...messages.value, ...relevant];
  }
});

const unsubDelete = actionStore.deleteBus.on((ids) => {
  messages.value = messages.value.filter((m) => !ids.includes(m.id));
});

const unsubUpdate = actionStore.updateBus.on(({ id, updates }) => {
  const index = messages.value.findIndex((m) => m.id === id);
  if (index !== -1) {
    messages.value[index] = { ...messages.value[index], ...updates };
    // If ID changed (temp → real), update the reference
    if (updates.id && updates.id !== id) {
      messages.value = [...messages.value];
    }
  }
});

// ─── Lifecycle ──────────────────────────────────────────────────────────────

onMounted(() => {
  fetchMessages(1);
});

watch(
  () => props.conversationId,
  () => {
    messages.value = [];
    currentPage.value = 1;
    hasMorePages.value = true;
    fetchMessages(1);
  },
);

onBeforeUnmount(() => {
  unsubSend();
  unsubDelete();
  unsubUpdate();
});

// ─── Expose ─────────────────────────────────────────────────────────────────

defineExpose({
  messages: extendedMessages,
  loading,
  loadMore,
  hasMorePages,
  fetchMessages,
});
</script>

<template>
  <div class="chat-messages">
    <!-- Loading indicator -->
    <div v-if="loading && messages.length === 0" class="chat-messages__loading">
      <slot name="loading">
        <div class="chat-messages__spinner" />
      </slot>
    </div>

    <!-- Load more trigger -->
    <div
      v-if="hasMorePages && !loading && messages.length > 0"
      class="chat-messages__load-more"
    >
      <slot name="load-more" :load-more="loadMore">
        <button @click="loadMore" class="chat-messages__load-more-btn">
          Load more
        </button>
      </slot>
    </div>

    <!-- Messages list -->
    <div class="chat-messages__list">
      <slot
        :messages="extendedMessages"
        :loading="loading"
        :load-more="loadMore"
      >
        <div
          v-for="msg in extendedMessages"
          :key="msg.id"
          class="chat-messages__item"
        >
          <slot name="message" :message="msg">
            <!-- Default message rendering -->
            <div
              class="chat-messages__bubble"
              :class="{
                'chat-messages__bubble--mine': msg.senderId === userId,
                'chat-messages__bubble--theirs': msg.senderId !== userId,
              }"
            >
              <p v-if="msg.text">{{ msg.text }}</p>
              <span class="chat-messages__time">
                {{ new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </slot>
        </div>
      </slot>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && messages.length === 0" class="chat-messages__empty">
      <slot name="empty">
        <p>No messages yet</p>
      </slot>
    </div>
  </div>
</template>

<style>
.chat-messages {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.chat-messages__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
}

.chat-messages__bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  word-break: break-word;
}

.chat-messages__bubble--mine {
  align-self: flex-end;
  background-color: var(--chat-bubble-mine);
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-messages__bubble--theirs {
  align-self: flex-start;
  background-color: var(--chat-bubble-theirs);
  color: var(--chat-on-surface);
  border-bottom-left-radius: 4px;
}

.chat-messages__time {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  text-align: end;
  margin-top: 2px;
}

.chat-messages__loading,
.chat-messages__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: var(--chat-on-surface-secondary);
}

.chat-messages__spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--chat-outline-variant);
  border-top-color: var(--chat-primary);
  border-radius: 50%;
  animation: chat-spin 0.8s linear infinite;
}

.chat-messages__load-more {
  display: flex;
  justify-content: center;
  padding: 8px;
}

.chat-messages__load-more-btn {
  padding: 6px 16px;
  border-radius: 16px;
  border: 1px solid var(--chat-outline-variant);
  background: var(--chat-surface-variant);
  color: var(--chat-on-surface-secondary);
  cursor: pointer;
  font-size: 0.85rem;
}

.chat-messages__load-more-btn:hover {
  background: var(--chat-surface-variant-2);
}

@keyframes chat-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
