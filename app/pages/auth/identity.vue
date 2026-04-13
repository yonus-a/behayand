<template>
    <div class=" w-full">
        <div class=" pb-8 md:hidden flex justify-between items-center w-full">
            <div></div>
            <div class=" text-label-sm select-none text-on-surface">{{ t('auth.identity.title') }}</div>
            <BIcon class="rtl:rotate-0 ltr:rotate-180 fill-on-surface cursor-pointer" @click="goBack"
                icon="PhArrowLeft" />
        </div>
        <div class=" md:block hidden mb-3 select-none text-on-surface text-label-sm">{{ t('auth.identity.title') }}
        </div>
        <BSelect :title="t('auth.profile.personalDetails.nationality')" class=" min-w-full"
            :placeholder="t('auth.profile.select')" :options="nationalities" v-model="nationality.value"
            :color="nationality.color" :message="nationality.message" />

        <BInput :maxlength="10" v-model="nationalId.value" type="number" :color="nationalId.color"
            :message="nationalId.message" :title="idCodeFieldProps.title" :placeholder="idCodeFieldProps.placeholder" />
        <div :class="[idNotMatched ? ' opacity-100 mb-4 p-3 h-12' : '  mb-0 opacity-0  p-0 h-0']"
            class="  whitespace-nowrap text-wrap flex items-center justify-between border border-error rounded-xl transition-all duration-200 ease-in-out w-full">
            <div class=" text-body-sm select-none text-error">{{ t('auth.identity.idNotMatched') }}</div>
            <RouterLink to="/auth">
                <div class=" text-primary cursor-pointer text-body-sm select-none">{{ t('auth.identity.changeNumber') }}
                </div>
            </RouterLink>
        </div>
        <BButton @click="validateFields" :disabled="hasErrors" :loading="isSending" class=" min-w-full w-full"
            :text="t('auth.register.continue')" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useI18n } from '#imports';
import { useValidation } from '#imports';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'IdentityPage',
    setup() {
        const router = useRouter()
        const { checkIsNationalCode, validateForeignCode } = useValidation()
        const { t } = useI18n()
        const nationality = ref({ value: 'iranian', color: 'primary', message: '' });
        const nationalId = ref({ value: '', color: 'primary', message: '' });
        const hasErrors = ref(false)
        const isSending = ref(false)
        const idNotMatched = ref(true)

        const nationalities = computed(() => [
            { value: 'iranian', label: t('auth.profile.personalDetails.nationalities.iranian') },
            { value: 'nonIranian', label: t('auth.profile.personalDetails.nationalities.nonIranian') },
        ]);

        const idCodeFieldProps = computed(() => {
            const isIranian = nationality.value.value === 'iranian';
            return {
                title: isIranian ? t('auth.profile.personalDetails.nationalCode') : t('auth.profile.personalDetails.foreignCode'),
                placeholder: isIranian ? t('auth.profile.personalDetails.nationalCodePlaceholder') : t('auth.profile.personalDetails.foreignCodePlaceholder')
            }
        });


        const formRefs = [nationality, nationalId];

        formRefs.forEach((fieldRef) => {
            watch(() => fieldRef.value.value, () => {
                resetField(fieldRef.value);
            });
        });

        const resetField = (field: any) => {
            field.color = 'primary';
            field.message = '';
            hasErrors.value = false;
        };

        const validateFields = () => {
            if (isSending.value || hasErrors.value) return
            if (nationality.value.value === 'iranian') {
                if (!checkIsNationalCode(nationalId.value.value)) {
                    nationalId.value.message = t('validation.national_id_invalid');
                    nationalId.value.color = 'error';
                    hasErrors.value = true;
                }
            } else {
                const foreignErr = validateForeignCode(nationalId.value.value);
                if (foreignErr) {
                    nationalId.value.message = foreignErr;
                    nationalId.value.color = 'error';
                    hasErrors.value = true;
                }
            }

            if (!hasErrors.value) {
                submitFields()
            }
        }

        const submitFields = async () => {
            if (isSending.value || hasErrors.value) return

            isSending.value = true;

            try {

            } catch (error) {

            } finally {
                isSending.value = false;
            }
        }

        const goBack = () => {
            router.go(-1)
        }

        return {
            t,
            goBack,
            nationality,
            idCodeFieldProps,
            idNotMatched,
            isSending,
            hasErrors,
            validateFields,
            nationalities,
            nationalId,
        }
    }
})
</script>