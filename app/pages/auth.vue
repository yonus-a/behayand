<template>
    <div class=" w-full  h-full">
        <NuxtPage />
    </div>
</template>

<script lang="ts">


definePageMeta({
    layout: 'auth'
})

export default defineComponent({
    name: 'AuthBasePage',

})
</script>