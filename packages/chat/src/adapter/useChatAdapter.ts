import { inject, provide, type InjectionKey } from "vue";
import type { ChatDataAdapter } from "./types";

export const ChatAdapterKey: InjectionKey<ChatDataAdapter> =
  Symbol("ChatDataAdapter");

/**
 * Provide a ChatDataAdapter instance to the component tree.
 */
export function provideChatAdapter(adapter: ChatDataAdapter): void {
  provide(ChatAdapterKey, adapter);
}

/**
 * Inject the ChatDataAdapter instance from the component tree.
 */
export function useChatAdapter(): ChatDataAdapter {
  const adapter = inject(ChatAdapterKey);
  if (!adapter) {
    throw new Error(
      "[@behayand/chat] No ChatDataAdapter provided. " +
        "Call provideChatAdapter() in a parent component or pass adapter prop to BehayandChat.",
    );
  }
  return adapter;
}
