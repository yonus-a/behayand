<template>
    <div class=" w-60 flex flex-col gap-y-2 p-3">
        <div class=" flex w-full items-center gap-x-2">
            <div class=" rounded-full overflow-hidden w-10 shrink-0 aspect-square">
                <BImage :src="profileStore.userData.imageUrl" />
            </div>
            <div class=" flex-1 shrink-0 flex flex-col gap-y-0.5 select-none text-on-surface">
                <div class=" text-label-md">{{ profileStore.userData.name }} {{ profileStore.userData.lastName }}</div>
                <div class=" opacity-50 text-body-sm">{{ profileStore.userData.phoneNumber }}</div>
            </div>
        </div>
        <div class=" w-full h-px rounded-full bg-outline-variant"></div>
        <div class=" w-full flex flex-col gap-y-1">
            <div :class="[route.color]" class=" w-full flex items-center h-10 p-2.5 gap-x-2 cursor-pointer"
                v-for="route in routes" :key="route.key" @click="handleRouteClick(route.key)">
                <BIcon :icon="route.icon" class="w-5 h-5" />
                <div class=" select-none text-body-sm">{{ route.label }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useI18n, useLocalePath, useProfileStore, useAuthStore } from '#imports';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'ProfileDetails',
    setup() {
        const { t } = useI18n()
        const profileStore = useProfileStore()
        const router = useRouter()
        const localePath = useLocalePath()
        const authStore = useAuthStore()
        const isLoading = computed(() => profileStore.isLoading)

        const routes = computed(() => [
            {
                key: 'profile',
                label: t('profile.routes.profile'),
                path: '/dashboard/profile',
                icon: 'PhUser',
                color: 'text-on-surface/70'
            },
            {
                key: 'addresses',
                label: t('profile.routes.addresses'),
                path: '/dashboard/addresses',
                icon: 'PhMapPin',
                color: 'text-on-surface/70'
            },
            {
                key: 'settings',
                label: t('profile.routes.settings'),
                path: '/dashboard/settings',
                icon: 'PhGear',
                color: 'text-on-surface/70'
            },
            {
                key: 'logout',
                label: t('profile.routes.logout'),
                icon: 'PhSignOut',
                color: 'text-error'
            },
        ])

        const handleRouteClick = (key: string) => {
            let targetRouteItem = routes.value.find((route) => route.key === key)
            if (!targetRouteItem?.path || targetRouteItem.path.trim().length == 0) {
                switch (key) {
                    case 'logout':
                        authStore.logout()
                        break;
                }
            } else {
                router.push(localePath(targetRouteItem.path))
            }
        }


        return {
            handleRouteClick,
            routes,
            isLoading,
            profileStore,
        }
    }
})
</script>