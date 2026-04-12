<template>
    <div class=" w-dvw bg-surface h-dvh flex">
        <div class="flex flex-col items-center gap-y-16 basis-1/2">
            <div class=" flex pt-6 shrink-0 items-center gap-x-3">
                <ThemeSwitch />
                <LocaleSwitch />
            </div>
            <div class=" w-full flex-1 flex justify-center items-center">
                <div class=" shadow-floating bg-surface rounded-3xl w-99 p-6 ">
                    <AuthHeader v-if="routeDetails.routesWithHeader.includes(route.path)" :title="routeDetails.title"
                        :description="routeDetails.description" />
                    <NuxtPage />
                </div>
            </div>
        </div>
        <div class=" basis-1/2">
            <BImage :src="backgroundImage" fit="cover"
                class=" min-w-full min-h-full max-w-full max-h-full h-full w-full" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from '#imports';
import backgroundImage from '/images/auth/auth-bg.webp';
import AuthHeader from '@/components/auth/FormHeader.vue';
import ThemeSwitch from '~/components/general/ThemeSwitch.vue';
import LocaleSwitch from '~/components/general/LocaleSwitch.vue';

const { t } = useI18n();
const route = useRoute();
const selectedUsername = ref('');

const routeDetails = computed(() => ({
    routesWithHeader: ['/auth', '/auth/password', '/auth/verify', '/auth/register'],
    title: route.path === '/auth' ? t('auth.login.title') : t('auth.register.title'),
    description: route.path === '/auth' ? t('auth.login.enterDetails') : selectedUsername.value
}));
</script>