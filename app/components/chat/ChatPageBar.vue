<template>
    <div v-if="selectedChat"
        class="w-full h-20 gap-x-4 bg-surface border-b border-b-outline-variant flex items-center justify-between py-4 px-5">

        <div @click="openProfile" class="cursor-pointer flex items-center gap-x-3">
            <div class="w-10 h-10 relative shrink-0">
                <BImage class="min-w-full min-h-full max-w-full max-h-full h-full w-full rounded-full overflow-hidden"
                    :src="selectedChat?.imageUrl" />
                <div v-if="selectedChat.isOnline"
                    class="absolute right-0 bottom-0 bg-primary rounded-full w-2.5 h-2.5 border-2 border-surface"></div>
            </div>
            <div class="select-none">
                <div class="text-on-surface text-label-md">{{ selectedChat.name }} {{ selectedChat.lastName }}</div>
                <div class="text-on-surface/50 text-body-sm">
                    {{ t('chat.lastSeen', { time: formatRelativeDate(selectedChat.lastSeen) }) }}
                </div>
            </div>
        </div>

        <div class="flex items-center gap-x-4">
            <BIcon icon="PhPhone" v-if="selectedChat.serviceType !== 'chat'"
                class="w-6 h-6 fill-on-surface/50 cursor-pointer" @click="handleAction('call')" />


            <BMenu ref="menuRef">
                <template #trigger>
                    <BIcon icon="PhDotsThreeVertical" class="w-6 h-6 fill-on-surface/50 cursor-pointer"
                        aria-haspopup="true" aria-controls="overlay_menu" />
                </template>
                <div class=" flex flex-col gap-y-1 select-none w-60 p-3">
                    <div @click="handleMenuAction(option.key)" v-for="option in menuOptions" :key="option.key"
                        :class="[option.color && option.color === 'error' ? ' hover:bg-error/10 bg-error/0' : 'hover:bg-surface-variant-2 bg-surface-variant-2/0']"
                        class=" cursor-pointer group  transition-all duration-200 ease-in-out rounded-xl w-full flex items-center px-2.5 py-3 gap-x-2">
                        <BIcon
                            :class="[option.color && option.color === 'error' ? 'fill-error' : 'fill-on-surface/50 group-hover:fill-on-surface']"
                            class=" transition-all duration-200 ease-in-out w-5 h-5" weight="bold"
                            :icon="option.icon" />
                        <div class=" text-label-sm transition-all duration-200 ease-in-out"
                            :class="[option.color && option.color === 'error' ? 'text-error' : 'text-on-surface/50 group-hover:text-on-surface']">
                            {{ option.label }}</div>
                    </div>
                </div>
            </BMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, type PropType } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore, useI18n, useDate } from '#imports';
import type { Menu } from '~/types/components/menu';
import type { Contact } from '~/types/chat';

export default defineComponent({
    name: 'PageBar',
    props: {
        contact: {
            type: Object as PropType<Contact | null>,
            required: true,
        }
    },
    emits: ['call', 'open-profile'],
    setup(props, { emit }) {
        const { formatRelativeDate } = useDate();
        const chatStore = useChatStore();
        const route = useRoute();
        const { t } = useI18n();
        const menuRef = ref<Menu | null>(null)
        const selectedChat = computed(() => props.contact)

        // Template Ref for the Menu



        const menuOptions = computed(() => [
            {
                label: t('chat.barOptions.prescribeMedications'),
                icon: 'PhPencilSimpleLine',
                key: 'prescribe-meds',
            },
            {
                label: t('chat.barOptions.addPerson'),
                icon: 'PhUserPlus',
                key: 'add-user',
            },
            {
                label: t('chat.barOptions.refer'),
                icon: 'PhTreeStructure',
                key: 'refer',
            },
            {
                label: t('chat.barOptions.endChat'),
                icon: 'PhXSquare',
                key: 'end-chat',
            },
            {
                label: t('chat.barOptions.deleteMessages'),
                icon: 'PhTrash',
                key: 'delete-all',
                color: 'error'
            },
        ])

        const actions = ref([
            { icon: 'PhPhone', key: 'call' },
            //    { icon: 'PhMagnifyingGlass', key: 'search' },
        ]);

        const handleAction = (key: 'search' | 'call') => {
            switch (key) {
                case 'call':
                    emit('call')
                    break;
                case 'search':

                    break;
            }
        };

        const handleMenuAction = (key: 'delete-all' | 'end-chat' | 'refer' | 'add-user') => {
            switch (key) {
                case 'add-user':

                    break;
                case 'delete-all':

                    break;
                case 'end-chat':

                    break;
                case 'refer':

                    break;
            }
            menuRef.value?.close()
        }

        const openProfile = () => {
            emit('open-profile')
        }

        return {
            t,
            selectedChat,
            formatRelativeDate,
            actions,
            menuOptions,
            handleMenuAction,
            handleAction,
            menuRef,
            openProfile,
        };
    }
})
</script>