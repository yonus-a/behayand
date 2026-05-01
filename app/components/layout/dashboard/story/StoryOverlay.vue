<template>
    <div class=" w-full h-full" @click.self="closeStory"></div>
</template>
<script lang="ts">
import { ref, defineComponent, type PropType } from 'vue';
import type { Story } from '~/types/story';
import { useStoriesStore } from '#imports';

export default defineComponent({
    name: 'StoryOverlay',
    props: {
        stories: {
            type: Object as PropType<Story>,
            required: true,
        }
    },
    setup(props, { emit, expose }) {
        const storiesStore = useStoriesStore()
        const isOpen = ref(false)
        const opennedIndex = ref(10)

        const openStory = () => {
            isOpen.value = true;
        }

        const closeStory = () => {
            isOpen.value = false;
        }


        expose({
            closeStory,
        })



        return {
            storiesStore,
            closeStory,
            opennedIndex,
        }
    }
})
</script>