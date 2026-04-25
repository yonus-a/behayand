<template>
    <div class=" w-60 h-60 rounded-full bg-surface aspect-square overflow-hidden p-3">
        <div class=" p-1 w-full h-full rounded-full border-primary overflow-hidden">
            <div class=" relative w-full h-full rounded-full overflow-hidden">
                <div class=" absolute inset-0 top-0 left-0 w-full h-full flex items-center justify-center"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VideoDisplay',
    props: {
        videoUrl: {
            type: String,
            default: ''
        }
    },
    setup(props) {


        return {

        }
    }
})
</script>