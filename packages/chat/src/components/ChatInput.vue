<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { useChatActionStore } from "../stores/chatActionStore";
import { useChat } from "../composables/useChat";
import type { Message } from "../types/chat";

const props = defineProps<{
  /** The active conversation ID */
  conversationId: number;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Max recording duration in seconds */
  maxRecordingDuration?: number;
  /** Whether to show emoji picker */
  showEmojiPicker?: boolean;
  /** Whether to show attachment button */
  showAttachment?: boolean;
  /** Whether to show voice recording button */
  showVoiceRecord?: boolean;
  /** Whether to show video recording button */
  showVideoRecord?: boolean;
}>();

const emit = defineEmits<{
  (e: "send", message: Partial<Message>): void;
  (e: "typing"): void;
  (e: "attachment", files: File[]): void;
}>();

const { userId, t } = useChat();
const actionStore = useChatActionStore();

// ─── State ──────────────────────────────────────────────────────────────────

const inputText = ref("");
const inputRef = ref<HTMLDivElement | null>(null);
const isFocused = ref(false);

// ─── Computed ───────────────────────────────────────────────────────────────

const isEditing = computed(() => !!actionStore.editingMessage);
const isReplying = computed(() => !!actionStore.replyingTo);
const hasContent = computed(() => inputText.value.trim().length > 0);

// ─── Methods ────────────────────────────────────────────────────────────────

const handleSend = () => {
  const text = inputText.value.trim();
  if (!text) return;

  if (isEditing.value && actionStore.editingMessage) {
    actionStore.saveEditMessage(actionStore.editingMessage.id, text);
  } else {
    const message: Partial<Message> = {
      conversationId: props.conversationId,
      type: "text",
      text,
      senderId: userId,
      date: new Date(),
      isEdited: false,
      isSent: false,
      isRead: false,
    };

    if (isReplying.value && actionStore.replyingTo) {
      message.repliedTo = actionStore.replyingTo;
    }

    emit("send", message);

    // Also send via store
    actionStore.sendMessage([message as Message]);
  }

  inputText.value = "";
  actionStore.clearActions();

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.textContent = "";
      inputRef.value.focus();
    }
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
  if (event.key === "Escape") {
    actionStore.clearActions();
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLDivElement;
  inputText.value = target.textContent || "";
  emit("typing");
};

const handleAttachment = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    emit("attachment", Array.from(input.files));
  }
};

const cancelAction = () => {
  actionStore.clearActions();
};

// ─── Edit Mode Setup ────────────────────────────────────────────────────────

const unsubEdit = actionStore.editBus.on((message) => {
  if (message && inputRef.value) {
    inputText.value = message.text || "";
    inputRef.value.textContent = message.text || "";
    nextTick(() => inputRef.value?.focus());
  }
});

const focus = () => {
  inputRef.value?.focus();
};

defineExpose({ focus });
</script>

<template>
  <div class="chat-input">
    <!-- Reply/Edit indicator -->
    <div v-if="isReplying || isEditing" class="chat-input__action-bar">
      <div class="chat-input__action-info">
        <span class="chat-input__action-label">
          {{ isEditing ? t('chat.editing') : t('chat.replying') }}
        </span>
        <span class="chat-input__action-text">
          {{
            isEditing
              ? actionStore.editingMessage?.text
              : actionStore.replyingTo?.text
          }}
        </span>
      </div>
      <button class="chat-input__action-cancel" @click="cancelAction">
        ✕
      </button>
    </div>

    <!-- Main input area -->
    <div class="chat-input__container">
      <!-- Attachment button -->
      <slot name="attachment-button">
        <label
          v-if="showAttachment !== false"
          class="chat-input__btn"
        >
          <input
            type="file"
            multiple
            hidden
            @change="handleAttachment"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </label>
      </slot>

      <!-- Text input -->
      <div
        ref="inputRef"
        class="chat-input__field"
        contenteditable="true"
        :data-placeholder="placeholder || t('chat.typeMessage')"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Send button -->
      <button
        v-if="hasContent"
        class="chat-input__send-btn"
        @click="handleSend"
      >
        <slot name="send-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </slot>
      </button>

      <!-- Voice/Video record buttons (when no text) -->
      <div v-else class="chat-input__record-buttons">
        <slot name="record-buttons" />
      </div>
    </div>
  </div>
</template>

<style>
.chat-input {
  border-top: 1px solid var(--chat-outline-variant);
  background-color: var(--chat-surface);
  padding: 8px 16px;
}

.chat-input__action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: var(--chat-surface-variant);
  border-inline-start: 3px solid var(--chat-primary);
}

.chat-input__action-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.chat-input__action-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--chat-primary);
}

.chat-input__action-text {
  font-size: 0.8rem;
  color: var(--chat-on-surface-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-input__action-cancel {
  background: none;
  border: none;
  color: var(--chat-on-surface-secondary);
  cursor: pointer;
  padding: 4px 8px;
  font-size: 1rem;
}

.chat-input__container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-input__field {
  flex: 1;
  min-height: 36px;
  max-height: 120px;
  overflow-y: auto;
  padding: 8px 12px;
  border-radius: 18px;
  background-color: var(--chat-surface-variant);
  border: 1px solid var(--chat-outline-variant);
  outline: none;
  font-size: 0.9rem;
  color: var(--chat-on-surface);
  word-break: break-word;
  transition: border-color 0.2s;
}

.chat-input__field:focus {
  border-color: var(--chat-primary);
}

.chat-input__field:empty::before {
  content: attr(data-placeholder);
  color: var(--chat-on-surface-secondary);
  pointer-events: none;
}

.chat-input__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: none;
  color: var(--chat-on-surface-secondary);
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input__btn:hover {
  background-color: var(--chat-surface-variant);
}

.chat-input__send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: var(--chat-primary);
  color: white;
  cursor: pointer;
  transition: transform 0.1s;
}

.chat-input__send-btn:active {
  transform: scale(0.95);
}

.chat-input__record-buttons {
  display: flex;
  gap: 4px;
}
</style>
