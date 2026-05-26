<template>
  <div
    class="behayand-chat-contact-item"
    :class="{ active: isActive }"
    @click="$emit('select', contact)"
  >
    <div class="avatar">
      <img :src="contact.imageUrl" :alt="contact.name" />
      <span v-if="contact.isOnline" class="online-dot"></span>
    </div>
    <div class="info">
      <div class="name-row">
        <span class="name">{{ contact.name }} {{ contact.lastName }}</span>
        <span v-if="contact.lastMessage" class="time">
          {{ formatRelativeDate(contact.lastMessage.date) }}
        </span>
      </div>
      <div class="message-row">
        <span class="last-message">{{ contact.lastMessage?.text || "" }}</span>
        <span v-if="contact.unreadCount" class="badge">{{ contact.unreadCount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Contact } from "../types";
import { useDate } from "../composables/useDate";

export default defineComponent({
  name: "ChatContactItem",
  props: {
    contact: { type: Object as PropType<Contact>, required: true },
    isActive: { type: Boolean, default: false },
  },
  emits: ["select"],
  setup() {
    const { formatRelativeDate } = useDate();
    return { formatRelativeDate };
  },
});
</script>
