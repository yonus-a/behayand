<template>
    <div class=" w-full h-full ">

    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Message, Contact } from '~/types/chat';
import ChatBubble from './ChatBubble.vue';


export default defineComponent({
    name: 'ChatMessages',
    components: {
        ChatBubble,
    },
    setup() {

        return {

        }
    }
})
</script>