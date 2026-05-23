<template>
    <ClientOnly>
        <component :is="activeLayout" v-bind="layoutProps">
            <slot />
        </component>

        <template #placeholder>
            <div class="w-full h-dvh bg-surface animate-pulse"></div>
        </template>
        <MobileNavigation v-if="layoutProps.hasMobileNav" />
    </ClientOnly>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useWindowSize, useRoute } from '#imports';

// Import layouts as components
import DashboardLayout from './dashboard.vue';
import MobileLayout from './mobile.vue';
import MobileNavigation from '~/components/layout/dashboard/MobileNavigation.vue';

const { width } = useWindowSize();
const route = useRoute();

// 1. Initialize the layout synchronously for the client
// This runs in the 'setup' phase, BEFORE mounting.
const activeLayout = shallowRef(DashboardLayout);

if (import.meta.client) {
    // Determine layout immediately before the first render pass
    activeLayout.value = window.innerWidth < 768 ? MobileLayout : DashboardLayout;
}

// 2. Keep it reactive if the user resizes the window
watch(width, (newWidth) => {
    if (!newWidth) return;
    activeLayout.value = newWidth < 768 ? MobileLayout : DashboardLayout;
});

const layoutProps = computed(() => ({
    headerTitle: route.meta.headerTitle as string,
    backPath: route.meta.backPath as string,
    backIcon: route.meta.backIcon as string,
    showBack: route.meta.showBack !== false,
    hasMobileNav: route.meta.showMobileNav,
}));
</script>