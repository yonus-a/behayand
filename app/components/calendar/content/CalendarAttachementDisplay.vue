<template>
    <div dir="rtl"
        class=" max-w-57.5 bg-surface border-outline-variant border p-1 rounded-xl flex justify-end items-center">
        <FileDisplay :url="url" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import FileDisplay from '~/components/chat/chat-bubbles/FileDisplay.vue';

export default defineComponent({
    name: '',
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    components: {
        FileDisplay,
    },
    setup(props) {



        return {

        }
    }
})
</script>