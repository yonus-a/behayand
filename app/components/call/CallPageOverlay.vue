<template>
    <div class=" flex flex-col w-full h-full bg-diamond-black ">
        <div class=" h-20 flex items-center justify-between px-4">
            <div class="md:block hidden text-white select-none text-label-lg">{{ t('chat.call.title') }}</div>
            <div class=" bg-black-500 md:hidden rounded-full flex items-center gap-x-4 h-10 px-3">
                <BIcon icon="PhLightning" @click="handleOptions('toggle-flash')"
                    class=" cursor-pointer fill-white w-6 h-6" />
                <BIcon icon="PhArrowsClockwise" @click="handleOptions('flip-camera')"
                    class=" cursor-pointer fill-white w-6 h-6" />
            </div>
            <div class=" flex items-center gap-x-4.5">
                <div
                    class=" h-6 flex items-center justify-center bg-diamond-error rounded-full px-2 text-white select-none">
                    <div class=" text-body-sm">00:20</div>
                </div>
                <BIcon icon="PhArrowLeft" @click="goBack" class=" w-5 h-5 fill-white cursor-pointer" />
            </div>
        </div>
        <div class="w-full flex-1 min-h-0">
            <div :class="gridLayoutClasses">
                <CallMemberDisplay v-for="(member, index) in callMembers.slice(0, 6)" :key="member.id" :contact="member"
                    :class="getMemberClass(index)" />
            </div>
        </div>
        <div
            class=" w-full h-21 flex justify-center gap-x-1.5 sm:gap-x-3 items-center bg-black-600 border-t border-t-[#2C2C2E]">
            <div class=" bg-black-500 w-9 sm:w-12 cursor-pointer aspect-square rounded-full flex items-center justify-center"
                @click="handleOptions(option.key)" v-for="option in optionButtons" :key="option.key">
                <BIcon :icon="option.icon" class=" sm:w-6 sm:h-6 w-4 h-4 fill-white" />
            </div>
            <div @click="handleOptions('leave-call')"
                class=" rounded-full w-12 sm:w-15 aspect-square bg-diamond-error cursor-pointer flex items-center justify-center">
                <BIcon icon="PhPhoneX" class=" w-5 h-5 sm:w-7 sm:h-7 fill-white" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { type PropType, defineComponent, computed } from 'vue';
import type { Contact } from '~/types/chat';
import { useI18n, useCallStore, useWindowSize } from '#imports';
import { useRouter } from 'vue-router';
import CallMemberDisplay from './CallMemberDisplay.vue';
export default defineComponent({
    name: 'CallPageOverlay',
    props: {
        contacts: {
            type: Object as PropType<Contact[]>,
            required: true,
            default: () => []
        }
    },
    components: {
        CallMemberDisplay,
    },
    setup(props) {
        const router = useRouter()
        const { t } = useI18n()
        const callStore = useCallStore()
        const { width } = useWindowSize()


        const isMobile = computed(() => width.value < 768);

        const gridLayoutClasses = computed(() => {
            const count = callMembers.value.length;
            const gap = isMobile.value ? 'gap-3' : 'gap-4';
            const base = `grid w-full h-full p-4 ${gap}`;

            if (count === 1) return `${base} grid-cols-1 grid-rows-1`;
            if (count === 2) return `${base} grid-cols-1 grid-rows-2`;
            if (count === 3) return `${base} grid-cols-1 grid-rows-3`;
            if (count === 4) return `${base} grid-cols-2 grid-rows-2`;
            if (count === 6) return `${base} grid-cols-2 grid-rows-3`;

            return `${base} grid-cols-2`;
        });

        const getMemberClass = (index: number) => {
            if (callMembers.value.length === 5 && index === 0) return 'col-span-2';
            return '';
        };


        const callMembers = computed(() => callStore.callMembers)

        const optionButtons = computed(() => [
            {
                icon: 'PhX',
                key: 'end-call'
            },
            {
                icon: 'PhMonitorArrowUp',
                key: 'share-screen'
            },
            {
                icon: 'PhUserPlus',
                key: 'add-user'
            },
            {
                icon: 'PhSpeakerHigh',
                key: 'toggle-sound'
            },
            {
                icon: 'PhMicrophone',
                key: 'toggle-mic'
            },
            {
                icon: 'PhVideoCamera',
                key: 'toggle-video'
            },
        ])

        const goBack = () => {
            router.go(-1)
        }

        const handleOptions = (key: string) => {
            switch (key) {
            }
        }

        return {
            t,
            optionButtons,
            callMembers,
            goBack,
            handleOptions,
            gridLayoutClasses,
            getMemberClass,
            isMobile
        }
    }
})
</script>