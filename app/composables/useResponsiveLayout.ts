import { watch, nextTick } from "vue";
import { useWindowSize, setPageLayout, useRoute } from "#imports";

export const useResponsiveLayout = (
  mobileLayout = "mobile",
  desktopLayout = "dashboard",
) => {
  // 1. Run synchronously during setup, but ONLY in the browser
  if (import.meta.client) {
    const { width } = useWindowSize();
    const route = useRoute();

    // 2. Watch the width directly instead of a computed boolean
    watch(
      width,
      (newWidth) => {
        // Safety: composables like useWindowSize sometimes init at 0 before hydration
        if (!newWidth || newWidth === 0) return;

        const targetLayout = newWidth < 768 ? mobileLayout : desktopLayout;

        // THE CIRCUIT BREAKER
        nextTick(() => {
          if (route.meta.layout !== targetLayout) {
            route.meta.layout = targetLayout;
            setPageLayout(targetLayout);
          }
        });
      },
      { immediate: true },
    );
  }
};
