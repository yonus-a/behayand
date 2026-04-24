<template>
    <div class=" transition-all duration-200 ease-in-out h-full  overflow-hidden text-wrap whitespace-nowrap"
        :class="[isOpen ? 'w-auto' : 'w-0']">
        <div class=" w-full bg-surface h-full transition-all duration-200 ease-in-out"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import type { Contact } from '~/types/chat';
import { useRoute, useRouter } from 'vue-router';


export default defineComponent({
    name: 'ChatProfileOverview',
    props: {
        profile: {
            type: Object as PropType<Contact | null>,
            required: true,
        }
    },
    setup() {
        const router = useRouter()
        const route = useRoute()

        const isOpen = ref(false)

        return {
            isOpen,
        }
    }
})
</script>