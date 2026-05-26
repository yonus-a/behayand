<template>
  <div class="behayand-chat" :class="[dir === 'rtl' ? 'behayand-rtl' : 'behayand-ltr']">
    <div class="chat-layout">
      <!-- Contact list sidebar -->
      <div v-if="showContactList" class="contact-sidebar">
        <ChatContactList />
      </div>

      <!-- Main chat area -->
      <div v-if="showChatArea" class="chat-main">
        <template v-if="activeConversation">
          <ChatHeader
            :contact="activeConversation"
            :show-back-button="isMobile"
            @back="closeConversation"
            @open-profile="$emit('openProfile', activeConversation)"
          >
            <template #actions>
              <slot name="header-actions" :contact="activeConversation"></slot>
            </template>
          </ChatHeader>

          <ChatMessages
            :conversation-id="chatStore.activeConversationId!"
            :contact="activeConversation"
          />

          <ChatInput
            :conversation-id="chatStore.activeConversationId!"
            :is-active="activeConversation.isActive"
            @message-sent="$emit('messageSent', $event)"
          />
        </template>

        <div v-else class="no-chat-selected">
          <p>{{ t('noConversationSelected') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide, onMounted, type PropType } from "vue";
import { useChatStore } from "../stores/chatStore";
import { useWindowSize } from "../composables/useWindowSize";
import type { ChatDataAdapter } from "../adapter/types";
import type { ChatConfig } from "../types";
import { TranslationsKey, createTranslationFn } from "../i18n";
import { ChatAdapterKey } from "../adapter/useChatAdapter";
import ChatContactList from "./ChatContactList.vue";
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatInput from "./ChatInput.vue";

export default defineComponent({
  name: "BehayandChat",
  components: { ChatContactList, ChatHeader, ChatMessages, ChatInput },
  props: {
    adapter: { type: Object as PropType<ChatDataAdapter>, required: true },
    config: { type: Object as PropType<ChatConfig>, default: () => ({}) },
  },
  emits: ["openProfile", "messageSent"],
  setup(props) {
    const chatStore = useChatStore();
    const { width } = useWindowSize();

    // Provide adapter
    provide(ChatAdapterKey, props.adapter);
    chatStore.setAdapter(props.adapter);

    // Provide translations
    const t = createTranslationFn(props.config.translations);
    provide(TranslationsKey, t);

    const dir = computed(() => props.config.dir || "ltr");
    const isMobile = computed(() => width.value < 768);
    const isInChat = computed(() => chatStore.activeConversationId !== null);

    const activeConversation = computed(() => {
      if (!chatStore.activeConversationId) return null;
      return chatStore.getContactById(chatStore.activeConversationId);
    });

    const showContactList = computed(() => {
      if (isMobile.value) return !isInChat.value;
      return true;
    });

    const showChatArea = computed(() => {
      if (isMobile.value) return isInChat.value;
      return true;
    });

    const closeConversation = () => {
      chatStore.setActiveConversation(null);
    };

    return {
      chatStore,
      dir,
      isMobile,
      activeConversation,
      showContactList,
      showChatArea,
      closeConversation,
      t,
    };
  },
});
</script>
