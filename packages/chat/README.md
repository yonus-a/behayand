# @yonus-a/chat

A themeable, data-agnostic Vue 3 chat module built with the adapter pattern. Extracted from behayand-frontend for reuse across projects.

## Features

- 🎨 **Fully Themeable** — CSS custom properties for complete visual customization
- 🔌 **Adapter Pattern** — Bring your own API; works with any backend
- 📦 **Tree-shakeable** — Import only the components you need
- 🌐 **RTL/LTR Support** — Built-in bidirectional text support
- 🎤 **Rich Media** — Voice recording, video recording, file attachments, images
- 📱 **Mobile-first** — Touch gestures, responsive design
- 🧩 **Slot-based** — Override any UI element with your own components
- 🧪 **Mock Adapter** — Included for development and testing

## Installation

```bash
npm install @yonus-a/chat
```

## Quick Start

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createChat } from '@yonus-a/chat'
import '@yonus-a/chat/style.css'
import App from './App.vue'
import { myApiAdapter } from './adapters/chatApi'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(createChat({
  adapter: myApiAdapter,
  userId: 1, // current authenticated user ID
  theme: {
    primary: '#3b82f6',
    direction: 'ltr',
  },
  pinia,
}))

app.mount('#app')
```

```vue
<!-- ChatPage.vue -->
<template>
  <ChatRoot :adapter="adapter" :theme="theme" :user-id="userId">
    <div class="chat-layout">
      <ChatList @select="onSelectConversation" :active-id="activeId" />
      <div v-if="activeId" class="chat-main">
        <ChatPageBar :contact="activeContact" @back="activeId = null" />
        <ChatMessages :conversation-id="activeId" :contact="activeContact" />
        <ChatInput :conversation-id="activeId" />
      </div>
    </div>
  </ChatRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChatRoot, ChatList, ChatPageBar, ChatMessages, ChatInput,
  type Contact, type ChatDataAdapter
} from '@yonus-a/chat'
import { myApiAdapter } from './adapters/chatApi'

const adapter: ChatDataAdapter = myApiAdapter
const theme = { primary: '#3b82f6', direction: 'ltr' as const }
const userId = 1

const activeId = ref<number | null>(null)
const activeContact = ref<Contact | null>(null)

const onSelectConversation = (contact: Contact) => {
  activeId.value = contact.id
  activeContact.value = contact
}
</script>
```

## Implementing Your Adapter

The `ChatDataAdapter` interface is the main abstraction for connecting to your API:

```typescript
// adapters/chatApi.ts
import type { ChatDataAdapter } from '@yonus-a/chat'
import { api } from './httpClient'

export const myApiAdapter: ChatDataAdapter = {
  async fetchConversations(filter, page, search) {
    const res = await api.get('/conversations', {
      params: { filter, page, search }
    })
    return {
      contacts: res.data.items,
      hasMore: res.data.hasMore
    }
  },

  async fetchMessages(conversationId, page) {
    const res = await api.get(`/conversations/${conversationId}/messages`, {
      params: { page }
    })
    return {
      messages: res.data.items,
      hasMore: res.data.hasMore
    }
  },

  async sendMessage(conversationId, messages) {
    const res = await api.post(`/conversations/${conversationId}/messages`, {
      messages
    })
    return res.data
  },

  async editMessage(messageId, newText) {
    const res = await api.patch(`/messages/${messageId}`, { text: newText })
    return res.data
  },

  async deleteMessages(messageIds) {
    await api.delete('/messages', { data: { ids: messageIds } })
  },

  async markAsRead(conversationId) {
    await api.post(`/conversations/${conversationId}/read`)
  },

  async uploadFile(file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/upload', formData, {
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded / e.total!) * 100))
    })
    return res.data.url
  },

  async downloadFile(url) {
    const res = await api.get(url, { responseType: 'blob' })
    return res.data
  },

  // Optional methods for medical features
  async sendServiceRequest(conversationId, serviceId, serviceLabel, providers) {
    const res = await api.post(`/conversations/${conversationId}/requests`, {
      serviceId, serviceLabel, providers
    })
    return res.data
  },
}
```

## Theming

Pass a theme object to customize colors:

```typescript
import type { ChatTheme } from '@yonus-a/chat'

const myTheme: Partial<ChatTheme> = {
  // Surfaces
  surface: '#1a1a2e',
  surfaceVariant: '#16213e',
  surfaceVariant2: '#0f3460',
  surfaceVariant3: '#533483',

  // Text
  onSurface: '#ffffff',
  onSurfaceSecondary: '#a0a0a0',

  // Accents
  primary: '#e94560',
  secondary: '#533483',
  error: '#ff6b6b',
  success: '#51cf66',

  // Bubbles
  bubbleMine: '#e94560',
  bubbleTheirs: '#16213e',

  // Layout
  direction: 'ltr',
  fontFamily: '"Inter", sans-serif',
}
```

All theme values are applied as CSS custom properties (`--chat-primary`, `--chat-surface`, etc.) on the root element.

## Using the Mock Adapter

For development and testing without a real backend:

```typescript
import { createChat, createMockAdapter } from '@yonus-a/chat'

const chat = createChat({
  adapter: createMockAdapter({
    delay: 300,          // API delay simulation (ms)
    contactCount: 50,    // Number of mock contacts
    messagesPerConversation: 25,
  }),
  userId: 99,
})
```

## Components

| Component | Description |
|-----------|-------------|
| `ChatRoot` | Root wrapper — provides theme, adapter, and config via injection |
| `ChatList` | Contact/conversation list with search and filters |
| `ChatMessages` | Message list with pagination and virtual scrolling support |
| `ChatInput` | Text input with attachment, emoji, and recording support |
| `ChatBubble` | Individual message bubble with status indicators |
| `ChatPageBar` | Header bar with contact info and actions |
| `ChatProfileOverview` | Contact profile sidebar |
| `ContactAvatar` | Avatar component with online indicator |
| `ChatContactDisplay` | Single contact list item |

## Composables

| Composable | Description |
|------------|-------------|
| `useChat()` | Access adapter, theme, userId, locale, t from any descendant |
| `useChatStore()` | Pinia store for conversations and messages state |
| `useChatActionStore()` | Pinia store for selection, editing, uploads |
| `useChatRecording()` | Voice/video recording with drag gestures |
| `useChatTheme()` | Access theme as CSS custom properties |

## Events & Buses

The module uses internal event buses for cross-component communication:

- `toastBus` — Subscribe to show toast notifications in your app
- `navigationBus` — Subscribe to handle routing/navigation
- `sendBus` — New messages sent
- `deleteBus` — Messages deleted
- `updateBus` — Messages updated (edits, ID swaps)

```typescript
import { useChatActionStore } from '@yonus-a/chat'

const actionStore = useChatActionStore()

// Listen for toast events
actionStore.toastBus.on(({ message, type }) => {
  // Show your own toast notification
  myToast.show(message, type)
})
```

## License

MIT
