<template>
    <div class=" w-full h-full">
        <div v-if="hasNotificationToDisplay">Hello</div>
        <div v-else class=" w-full h-full flex items-center justify-center">
            <NoDataDisplay />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import NoDataDisplay from '~/components/general/NoDataDisplay.vue';

export default defineComponent({
    name: 'NotificationDetails',
    components: {
        NoDataDisplay,
    },
    setup() {
        const route = useRoute()

        const hasNotificationToDisplay = computed(() => {
            const id = route.params.id;
            return !!id && !isNaN(Number(id));
        })

        return {
            hasNotificationToDisplay,
        }
    }
})
</script>