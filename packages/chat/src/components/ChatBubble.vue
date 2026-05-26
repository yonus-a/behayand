<template>
  <div
    class="behayand-chat-bubble"
    :class="{ mine: isMine, 'first-in-date': message.isFirstInDate }"
  >
    <div v-if="message.isFirstInDate" class="date-header">
      {{ formatDateHeader(message.date) }}
    </div>
    <div class="bubble-wrapper" :class="{ mine: isMine }">
      <div class="bubble" :class="{ mine: isMine }">
        <div v-if="message.repliedTo" class="reply-preview" @click="$emit('scrollToMessage', message.repliedTo.id)">
          <span class="reply-text">{{ message.repliedTo.text }}</span>
        </div>
        <div v-if="message.type === 'text'" class="text-content">
          {{ message.text }}
        </div>
        <div v-else-if="message.type === 'image'" class="image-content">
          <img v-for="(url, idx) in message.imageUrl" :key="idx" :src="url" class="message-image" />
        </div>
        <div v-else-if="message.type === 'file'" class="file-content">
          <a :href="message.fileUrl" target="_blank" class="file-link">📎 File</a>
        </div>
        <div v-else-if="message.type === 'voice'" class="voice-content">
          <audio :src="message.voiceUrl" controls class="voice-player"></audio>
        </div>
        <div class="bubble-meta">
          <span v-if="message.isEdited" class="edited-label">{{ t("edited") }}</span>
          <span class="time">{{ formatTime(message.date) }}</span>
          <span v-if="isMine" class="status">
            {{ message.isSent ? (message.isRead ? "✓✓" : "✓") : "⏳" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject, type PropType } from "vue";
import type { ExtendedMessage, CurrentUser } from "../types";
import { useDate } from "../composables/useDate";
import { TranslationsKey, type TranslationFn } from "../i18n";

export default defineComponent({
  name: "ChatBubble",
  props: {
    message: { type: Object as PropType<ExtendedMessage>, required: true },
    currentUser: { type: Object as PropType<CurrentUser>, required: true },
  },
  emits: ["scrollToMessage"],
  setup(props) {
    const { formatTime, formatDateHeader } = useDate();
    const t = inject(TranslationsKey)!;
    const isMine = computed(() => props.message.senderId === props.currentUser.id);
    return { isMine, formatTime, formatDateHeader, t };
  },
});
</script>
