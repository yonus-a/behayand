<template>
  <div class="behayand-chat-header" v-if="contact">
    <button v-if="showBackButton" class="back-btn" @click="$emit('back')">←</button>
    <div class="contact-info" @click="$emit('openProfile')">
      <div class="avatar">
        <img :src="contact.imageUrl" :alt="contact.name" />
        <span v-if="contact.isOnline" class="online-dot"></span>
      </div>
      <div class="details">
        <span class="name">{{ contact.name }} {{ contact.lastName }}</span>
        <span class="status">{{ contact.isOnline ? t("online") : formatRelativeDate(contact.lastSeen) }}</span>
      </div>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from "vue";
import type { Contact } from "../types";
import { useDate } from "../composables/useDate";
import { TranslationsKey, type TranslationFn } from "../i18n";

export default defineComponent({
  name: "ChatHeader",
  props: {
    contact: { type: Object as PropType<Contact>, default: null },
    showBackButton: { type: Boolean, default: false },
  },
  emits: ["back", "openProfile"],
  setup() {
    const { formatRelativeDate } = useDate();
    const t = inject(TranslationsKey)!;
    return { formatRelativeDate, t };
  },
});
</script>
