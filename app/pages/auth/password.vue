<template>
    <div class=" w-full">
        <BInput :title="t('auth.password.title')" :placeholder="t('auth.password.passwordPlaceholder')"
            v-model="password.value" :color="password.color" :message="password.message" />
        <BCheckBox v-model="rememberMe" :label="t('auth.password.rememberMe')" />
        <div class=" w-full flex mt-4 flex-col gap-y-3">
            <BButton @click="validateFields" class=" w-full" :text="t('auth.login.title')" :loading="isSending"
                :disabled="hasErrors" />
            <RouterLink to="/auth/verify">
                <BButton color="secondary" class=" w-full" :text="t('auth.password.loginViaCode')" />
            </RouterLink>
            <RouterLink to="/auth">
                <BButton type="ghost" class=" w-full" :text="t('auth.password.changeNumber')" />
            </RouterLink>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useI18n } from '#imports';
import { useValidation } from '#imports';
export default defineComponent({
    name: 'PasswordPage',
    setup() {
        const { validatePassword } = useValidation()
        const { t } = useI18n()
        const isSending = ref(false)
        const hasErrors = ref(false)

        const password = ref({
            value: '', color: 'primary', message: ''
        })

        const rememberMe = ref(false)

        watch(() => password.value.value, () => {
            password.value.color = 'primary'
            password.value.message = ''
            hasErrors.value = false;
        })

        const validateFields = () => {
            if (isSending.value || hasErrors.value) return


            if (!hasErrors.value) {
                submitPassword()
            }
        }

        const submitPassword = async () => {
            if (isSending.value || hasErrors.value) return
            isSending.value = true;
            try {

            } catch (error) {

            } finally {
                isSending.value = false;
            }
        }

        return {
            t,
            rememberMe,
            password,
            isSending,
            validateFields,
            hasErrors,
        }
    }
})
</script>