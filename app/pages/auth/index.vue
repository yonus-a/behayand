<template>
    <div class=" w-full flex flex-col ">
        <BInput :title="t('auth.login.username')" :placeholder="t('auth.login.usernamePlaceholder')"
            v-model="userName.value" :color="userName.color" :message="userName.message" />
        <div class=" w-full">
            
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { useValidation } from '#imports';
import { useI18n } from '#imports';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'AuthPage',
    setup() {
        const router = useRouter()
        const { t } = useI18n()
        const hasErrors = ref(false)
        const isSending = ref(false)
        const rememberMe = ref(false)

        const userName = ref({
            color: 'primary',
            value: '',
            message: ''
        })

        const validateFields = () => {
            if (isSending.value || hasErrors.value) return

            if (!hasErrors.value) {
                submitField()
            }
        }

        const submitField = async () => {
            if (isSending.value || hasErrors.value) return
            isSending.value = true

            try {

            } catch (error) {

            } finally {
                isSending.value = false;
                router.push('/auth/password')
            }
        }


        return {
            t,
            validateFields,
            isSending,
            userName,
            rememberMe,
            hasErrors,
        }
    }
})
</script>