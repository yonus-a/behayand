<template>
    <div class=" flex items-center gap-x-3">
        <BCheckBox v-model="rememberMe" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from '#imports';
export default defineComponent({
    name: 'PasswordPage',
    setup() {
        const { t } = useI18n()

        const rememberMe = ref(false)

        return {
            t,
            rememberMe,
        }
    }
})
</script>