<script setup lang="ts">
import { computed } from "vue";
import type { Contact } from "../../types/chat";

const props = defineProps<{
  /** The contact to display avatar for */
  contact: Contact;
  /** Whether to show online indicator */
  showOnline?: boolean;
  /** Size in pixels */
  size?: number;
}>();

const size = computed(() => props.size || 48);

const initials = computed(() => {
  const first = props.contact.name?.charAt(0) || "";
  const last = props.contact.lastName?.charAt(0) || "";
  return `${first}${last}`;
});

const showOnlineDot = computed(
  () => props.showOnline !== false && props.contact.isOnline,
);
</script>

<template>
  <div
    class="contact-avatar"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      v-if="contact.imageUrl"
      :src="contact.imageUrl"
      :alt="`${contact.name} ${contact.lastName}`"
      class="contact-avatar__img"
    />
    <span v-else class="contact-avatar__initials">
      {{ initials }}
    </span>
    <span v-if="showOnlineDot" class="contact-avatar__online" />
  </div>
</template>

<style>
.contact-avatar {
  position: relative;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: visible;
}

.contact-avatar__img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.contact-avatar__initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--chat-surface-variant-2);
  font-weight: 600;
  color: var(--chat-on-surface-secondary);
  font-size: 0.9em;
}

.contact-avatar__online {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--chat-success);
  border: 2px solid var(--chat-surface);
}
</style>
