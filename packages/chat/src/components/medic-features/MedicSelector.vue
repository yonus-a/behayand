<script setup lang="ts">
import { ref } from 'vue'

/**
 * Generic medic service/medication selector.
 * Fetches data via the adapter and allows searching/selecting items.
 */
defineProps<{
  visible: boolean
  title?: string
  placeholder?: string
  items: Array<{ id: number | string; label: string; [key: string]: any }>
  loading?: boolean
  multiple?: boolean
}>()

defineEmits<{
  (e: 'search', query: string): void
  (e: 'select', item: any): void
  (e: 'confirm', items: any[]): void
  (e: 'close'): void
}>()

const searchQuery = ref('')
const selectedItems = ref<any[]>([])

function toggleItem(item: any) {
  const idx = selectedItems.value.findIndex((s) => s.id === item.id)
  if (idx >= 0) {
    selectedItems.value.splice(idx, 1)
  } else {
    selectedItems.value.push(item)
  }
}
</script>

<template>
  <Transition name="slide">
    <div v-if="visible" class="medic-selector">
      <slot :items="items" :selected="selectedItems" :loading="loading">
        <div class="selector-header">
          <h3 class="selector-title">{{ title || 'Select' }}</h3>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>

        <div class="selector-search">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="placeholder || 'Search...'"
            class="search-input"
            @input="$emit('search', searchQuery)"
          />
        </div>

        <div class="selector-list">
          <div v-if="loading" class="loading-state">
            <slot name="loading">Loading...</slot>
          </div>

          <template v-else>
            <div
              v-for="item in items"
              :key="item.id"
              class="selector-item"
              :class="{ selected: selectedItems.some(s => s.id === item.id) }"
              @click="multiple ? toggleItem(item) : $emit('select', item)"
            >
              <slot name="item" :item="item">
                <span class="item-label">{{ item.label }}</span>
              </slot>
              <span
                v-if="multiple && selectedItems.some(s => s.id === item.id)"
                class="check-mark"
              >✓</span>
            </div>
          </template>
        </div>

        <div v-if="multiple && selectedItems.length > 0" class="selector-footer">
          <button class="confirm-btn" @click="$emit('confirm', selectedItems)">
            <slot name="confirm-text">
              Confirm ({{ selectedItems.length }})
            </slot>
          </button>
        </div>
      </slot>
    </div>
  </Transition>
</template>

<style scoped>
.medic-selector {
  position: absolute;
  inset: 0;
  background: var(--chat-surface, #fff);
  display: flex;
  flex-direction: column;
  z-index: 50;
}
.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--chat-outline-variant, #e0e0e0);
}
.selector-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--chat-on-surface, #333);
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--chat-on-surface-secondary, #666);
}
.selector-search {
  padding: 8px 16px;
}
.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--chat-outline-variant, #e0e0e0);
  border-radius: 8px;
  font-size: 13px;
  background: var(--chat-surface-variant, #f5f5f5);
  color: var(--chat-on-surface, #333);
  outline: none;
}
.search-input:focus {
  border-color: var(--chat-primary, #3b82f6);
}
.selector-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}
.loading-state {
  padding: 24px;
  text-align: center;
  color: var(--chat-on-surface-secondary, #666);
  font-size: 13px;
}
.selector-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.selector-item:hover {
  background: var(--chat-surface-variant, #f5f5f5);
}
.selector-item.selected {
  background: color-mix(in srgb, var(--chat-primary, #3b82f6) 10%, transparent);
}
.item-label {
  font-size: 13px;
  color: var(--chat-on-surface, #333);
}
.check-mark {
  color: var(--chat-primary, #3b82f6);
  font-weight: bold;
}
.selector-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--chat-outline-variant, #e0e0e0);
}
.confirm-btn {
  width: 100%;
  padding: 10px;
  background: var(--chat-primary, #3b82f6);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
