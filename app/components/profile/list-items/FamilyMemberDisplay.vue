<template>
    <div class=" w-full rounded-xl select-none bg-surface-variant px-3 flex justify-between items-center h-18 py-2">
        <div class="flex flex-col text-on-surface gap-y-1 ">
            <div v-loading="isLoading" class=" opacity-50 text-body-sm">{{ getRelation }}</div>
            <div v-loading="isLoading" class=" text-label-md">{{ member.name }} {{ member.lastName }}</div>
        </div>
        <BMenu v-if="!member.isHeadOfHousehold" :options="menuOptions" @select="handleOptionSelect">
            <template #trigger>
                <BIcon v-loading="isLoading" icon="PhDotsThreeVertical" weight="bold"
                    class=" w-5 aspect-square  fill-on-surface"
                    :class="[!isLoading ? 'cursor-pointer pointer-events-auto' : ' pointer-events-none']" />
            </template>
        </BMenu>
        <div class=" h-9 px-3 flex items-center justify-center select-none text-on-primary-container text-label-md rounded-lg bg-primary-container"
            v-else>
            {{ t('profile.familyMembers.houseHoldHead') }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useI18n } from '#imports';
import type { FamilyMember } from '~/types/profile';
import type { MenuOption } from '~/types/components/menu-options';
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

        const menuOptions = computed<MenuOption[]>(() => [
            {
                key: 'set-main',
                icon: 'PhUsersThree',
                label: t('profile.familyMembers.options.setAsHouseHoldHead'),
            },
            {
                key: 'delete',
                icon: 'PhTrash',
                label: t('profile.familyMembers.options.delete'),
                color: 'error'
            },
        ])

        const getRelation = computed(() => {
            const relationKey = props.member.relation;
            // Fallback to raw relation if translation missing
            return t(`profile.familyMembers.relations.${relationKey}`) || relationKey;
        });


        const handleOptionSelect = (key: string) => {
            switch (key) {
                case 'set-main':

                    break;
                case 'delete':

                    break;
            }
        }


        return {
            t,
            getRelation,
            menuOptions,
            isLoading,
            handleOptionSelect,
        }
    }
})
</script>