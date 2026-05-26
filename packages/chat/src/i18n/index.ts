import { type InjectionKey } from "vue";

export type TranslationFn = (key: string) => string;

export const TranslationsKey: InjectionKey<TranslationFn> = Symbol("ChatTranslations");

const defaultTranslations: Record<string, string> = {
  searchPlaceholder: "Search...",
  filterOnline: "Online",
  filterEnded: "Ended",
  filterActive: "Active",
  typeMessage: "Type a message...",
  chatEnded: "This conversation has ended",
  edited: "edited",
  online: "Online",
  replyingTo: "Replying to",
  editing: "Editing",
  noConversationSelected: "Select a conversation to start chatting",
  noMessages: "No messages yet",
};

export function createTranslationFn(custom?: Record<string, string>): TranslationFn {
  const merged = { ...defaultTranslations, ...custom };
  return (key: string) => merged[key] ?? key;
}
