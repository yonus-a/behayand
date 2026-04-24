// plugins/emoji-picker.client.ts
export default defineNuxtPlugin(() => {
  // We only import the side-effectful library here.
  // It registers 'emoji-picker' to the customElements registry.
  if (process.client) {
    import('emoji-picker-element');
  }
});