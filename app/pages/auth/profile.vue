<template>
    <div>
        <ImageUpload />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ImageUpload from '~/components/general/ImageUpload.vue';

export default defineComponent({
    name: 'ProfilePage',
    components: {
        ImageUpload,
    },
    setup() {


        return {

        }
    }
})
</script>