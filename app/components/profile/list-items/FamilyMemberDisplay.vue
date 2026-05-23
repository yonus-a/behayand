<template>
    <div class=" w-full rounded-xl select-none bg-surface-variant px-3 flex justify-between items-center h-18 py-2">
        <div class="flex flex-col text-on-surface gap-y-1 ">
            <div class=" opacity-50 text-body-sm">{{ getRelation }}</div>
            <div class=" text-label-md">{{ member.name }} {{ member.lastName }}</div>
        </div>
        <BMenu>
            <BIcon v-loading="isLoading" icon="PhDotsThreeVertical" weight="bold"
                class=" w-5 aspect-square  fill-on-surface"
                :class="[!isLoading ? 'cursor-pointer pointer-events-auto' : ' pointer-events-none']" />
        </BMenu>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useI18n } from '#imports';
import type { FamilyMember } from '~/types/profile';

export default defineComponent({
    name: 'FamilyMemberDisplay',
    props: {
        member: {
            type: Object as PropType<FamilyMember>,
            required: true,
        },
        loading: {
            type: Boolean,
            default: true
        }
    },
    setup(props, { emit }) {
        const { t } = useI18n()
        const isLoading = computed(() => props.loading)

        const menuOptions = computed(()=>[
            
        ])

        const getRelation = computed(() => 'kir')

        return {
            t,
            getRelation,
            isLoading,
        }
    }
})
</script>