# @behayand/chat

A reusable Vue 3 chat UI component with a pluggable data adapter pattern. Use this package to embed a full-featured chat interface into any Vue application with your own backend data.

## Installation

```bash
npm install @behayand/chat
```

## Quick Start

```vue
<template>
  <div style="height: 100vh">
    <BehayandChat :adapter="adapter" :config="chatConfig" />
  </div>
</template>

<script setup lang="ts">
import { BehayandChat, MockChatAdapter } from "@behayand/chat";
import "@behayand/chat/style.css";

// Use the mock adapter for development, or implement your own
const adapter = new MockChatAdapter({ id: 1, name: "John", lastName: "Doe" });

const chatConfig = {
  dir: "ltr",
  translations: {
    searchPlaceholder: "Search conversations...",
    typeMessage: "Write a message...",
  },
};
</script>
```

## Implementing a Custom Adapter

Create a class that implements the `ChatDataAdapter` interface:

```ts
import type { ChatDataAdapter, PaginatedContacts, PaginatedMessages, Message, Contact, CurrentUser, FilterKeys } from "@behayand/chat";

class MyApiAdapter implements ChatDataAdapter {
  getCurrentUser(): CurrentUser {
    return { id: 1, name: "John", lastName: "Doe" };
  }

  async fetchConversations(filter: FilterKeys, page: number, pageSize: number, search?: string): Promise<PaginatedContacts> {
    const res = await fetch(`/api/conversations?filter=${filter}&page=${page}&pageSize=${pageSize}&search=${search || ""}`);
    return res.json();
  }

  async fetchMessages(conversationId: number, page: number, pageSize: number): Promise<PaginatedMessages> {
    const res = await fetch(`/api/conversations/${conversationId}/messages?page=${page}&pageSize=${pageSize}`);
    return res.json();
  }

  async sendMessages(messages: Message[]): Promise<Message[]> {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });
    return res.json();
  }

  async editMessage(messageId: number, newText: string): Promise<Message> {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });
    return res.json();
  }

  async deleteMessages(messageIds: number[]): Promise<void> {
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: messageIds }),
    });
  }

  async markAsRead(conversationId: number): Promise<void> {
    await fetch(`/api/conversations/${conversationId}/read`, { method: "POST" });
  }

  async getContactById(contactId: number): Promise<Contact | null> {
    const res = await fetch(`/api/contacts/${contactId}`);
    if (!res.ok) return null;
    return res.json();
  }

  // Optional: implement file upload
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  }
}
```

## Configuration

The `config` prop accepts a `ChatConfig` object:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dir` | `"rtl" \| "ltr"` | `"ltr"` | Text direction |
| `translations` | `Record<string, string>` | `{}` | Custom translation strings |
| `menuOptions` | `MenuOption[]` | `[]` | Custom menu options in header |
| `showCallButton` | `boolean` | `false` | Show call button in header |
| `showMedicFeatures` | `boolean` | `false` | Show healthcare features |

## Theming

The chat UI uses CSS custom properties for theming. Override these variables to customize the appearance:

```css
:root {
  --behayand-primary: #3b82f6;
  --behayand-bg: #ffffff;
  --behayand-bg-hover: #f3f4f6;
  --behayand-bg-active: #eff6ff;
  --behayand-bg-chat: #f9fafb;
  --behayand-bg-input: #f9fafb;
  --behayand-text: #111827;
  --behayand-text-muted: #6b7280;
  --behayand-border: #e5e7eb;
}
```

## Available Exports

### Components

- `BehayandChat` - Main chat component (recommended)
- `ChatContactList` - Contact list sidebar
- `ChatContactItem` - Individual contact item
- `ChatMessages` - Message list area
- `ChatBubble` - Individual message bubble
- `ChatInput` - Message input area
- `ChatHeader` - Conversation header

### Utilities

- `MockChatAdapter` - Mock adapter for development
- `useChatStore` - Pinia store for chat state
- `useChatActionStore` - Pinia store for chat actions
- `useDate` - Date formatting composable
- `provideChatAdapter` / `useChatAdapter` - Provide/inject helpers

## Requirements

- Vue 3.3+
- Pinia 2.1+ or 3.x

## License

MIT
