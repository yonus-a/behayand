<template>
    <div class=" select-none text-on-surface w-full flex justify-center items-center">
        <div class="max-w-120 p-6 w-dvw flex flex-col ">
            <BImage :src="locationImage" class=" rounded-xl overflow-hidden w-full aspect-432/170" />
            <div class=" text-center mt-4 text-label-lg">{{ t('profile.address.location.title') }}</div>
            <div class=" text-center mt-3 text-body-md">{{ t('profile.address.location.description') }}</div>
            <div class=" mt-8 w-full flex justify-between items-center gap-x-3">
                <BButton :loading="isLoading" @click="handlePermission" :text="t('profile.address.location.allow')"
                    class=" basis-1/2" />
                <BButton @click="cancelPermission" :text="t('profile.address.location.deny')" class=" basis-1/2"
                    type="outline" color="secondary" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import locationImage from '/images/profile/location-permission.webp'
import { useI18n, useAppToast, useAppPermissions } from '#imports';

export default defineComponent({
    name: 'LocationPermision',
    emits: ['close', 'allowed'],
    setup(_, { emit }) {
        const { t } = useI18n()
        const { requestLocation } = useAppPermissions();
        const { openToast } = useAppToast();
        const isLoading = ref(false);

        const cancelPermission = () => {
            emit('close')
        }

        const handlePermission = async () => {
            isLoading.value = true;
            try {
                await requestLocation();
                emit('allowed');
                openToast(t('profile.address.location.success'), 'success')
            } catch (error: any) {
                openToast(t('profile.address.location.success'), 'success')
            } finally {
                isLoading.value = false;
            }
        };

        return {
            locationImage,
            t,
            handlePermission,
            isLoading,
            cancelPermission,
        }
    }
})
</script>