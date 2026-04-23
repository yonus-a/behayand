<template>
    <div class=" w-full h-full flex items-stretch center gap-x-6">
        <div class="  flex flex-col h-full basis-full md:basis-1/2">
            <div class="  w-full flex-1 md:border md:overflow-hidden md:rounded-xl md:border-outline-variant">
                <div
                    class=" select-none  md:flex hidden bg-surface border-b border-b-outline-variant items-center justify-between p-5">
                    <div class=" text-on-surface text-label-lg">{{ t('notifications.title') }}</div>
                    <BButton size="sm" @click="markAllAsRead" :loading="isMarkingAllAsRead" type="ghost"
                        :text="t('sidebar.readAll')" right-icon="PhChecks" />
                </div>
                <BVirtualVerticalList :pagination="isMobile" scrollbar v-if="notifications.length > 0 || isLoading"
                    :items="notifications" :loading="isLoading" :has-next-page="hasNextPage"
                    @load-more="notificationsStore.loadNextPage">
                    <template #item="{ item }">
                        <NotificationDisplay :loading="showLoading" :notification="item"
                            @click="handleNotificationClick(item)" />
                    </template>
                </BVirtualVerticalList>
                <div v-else class="h-full w-full flex items-center justify-center">
                    <NoDataDisplay :image-path="NoData" :title="t('notifications.noNotifications')" />
                </div>
            </div>
            <div class=" shrink-0 w-full hidden md:flex items-center justify-center pt-4">
                <BPagination v-model="desktopCurrentPage" :max-pages="maxPages" />
            </div>
        </div>
        <div class=" p-4 h-full md:block hidden md:basis-1/2 bg-surface-variant rounded-3xl">
            <NuxtPage v-slot="{ Component }">
                <component :is="Component" />
            </NuxtPage>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useI18n, useNotificationsStore, useWindowSize, useLocalePath } from '#imports';
import { useRouter } from 'vue-router';
import type { Notification } from '~/types/notification';
import NotificationDisplay from '~/components/layout/dashboard/header/NotificationDisplay.vue';
import NoDataDisplay from '~/components/general/NoDataDisplay.vue';
import NoData from '/images/dashboard/no-notifications.webp'

definePageMeta({
    layout: 'responsive',
    layoutTransition: false,
    headerTitle: 'notifications.title',
});

export default defineComponent({
    name: 'NotificationsPage',
    components: {
        NotificationDisplay,
        NoDataDisplay,
    },
    setup() {
        const router = useRouter();
        const localePath = useLocalePath()
        const { t } = useI18n();
        const { width } = useWindowSize()
        const notificationsStore = useNotificationsStore();
        const desktopCurrentPage = ref(1)
        const maxPages = computed(() => notificationsStore.maxPages)
        const isMobile = computed(() => width.value <= 768)
        const desktopNotifications = ref<Notification[]>([])
        const isLoadingDesktopNotifications = ref(true)

        
        // Store Bindings

        const isLoading = computed(() => {
            if (isMobile.value) {
                return notificationsStore.isLoading
            } else {
                return isLoadingDesktopNotifications.value
            }
        })


        const notifications = computed(() => {
            if (!isMobile.value) {
                return desktopNotifications.value
            } else {
                return notificationsStore.notifications
            }
        });
        const hasNextPage = computed(() => notificationsStore.hasNextPage);
        const currentPage = computed(() => notificationsStore.currentPage);
        const isMarkingAllAsRead = computed(() => notificationsStore.isMarkingAllAsRead);


        const markAllAsRead = () => {
            notificationsStore.markAllAsRead()
        }

        const goBack = () => {
            router.go(-1);
        };

        const handleNotificationClick = (notification: Notification) => {
            if (isLoading.value && currentPage.value === 1) return
            router.push(localePath(`/dashboard/notifications/${notification.id}`))
        };

        onMounted(() => {
            if (!notificationsStore.hasLoadedFirstPage) {
                notificationsStore.fetchNotifications(1);
            }
        });

        watch(() => desktopCurrentPage.value, () => {
            fetchDesktopNotifications()
        })

        const fetchDesktopNotifications = async () => {
            if (isMobile.value) return
            isLoadingDesktopNotifications.value = true;
            try {

            } catch (error) {

            } finally {
                isLoadingDesktopNotifications.value = false;
            }
        }

        const showLoading = computed(() => {
            if (isMobile.value) {
                return isLoading.value && currentPage.value === 1
            } else {
                return isLoadingDesktopNotifications.value
            }
        })

        return {
            t,
            goBack,
            isLoading,
            notifications,
            hasNextPage,
            notificationsStore,
            handleNotificationClick,
            showLoading,
            NoData,
            currentPage,
            markAllAsRead,
            isMarkingAllAsRead,
            desktopCurrentPage,
            maxPages,
            isMobile,
        };
    }
})
</script>