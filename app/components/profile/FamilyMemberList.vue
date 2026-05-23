<template>
    <div class=" w-full select-none rounded-2xl flex flex-col gap-y-4 md:p-4 md:border md:border-outline-variant">
        <div class=" text-on-surface text-title-sm">{{ t('profile.familyMembers.title') }}</div>
        <div class=" w-full flex flex-col gap-y-3 ">
            <FamilyMemberDisplay v-for="member in members" :key="member.id" :loading="isLoading" :member="member" />
            <div @click="addNewMember"
                class=" cursor-pointer bg-surface-variant h-18 px-3 rounded-xl flex items-center gap-x-2 text-primary">
                <BIcon icon="PhPlus" class="w-5 h-5" />
                <div class=" text-label-md">{{ t('profile.familyMembers.addFamilyMember') }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useI18n, useProfileStore } from '#imports';
import FamilyMemberDisplay from './list-items/FamilyMemberDisplay.vue';
import type { FamilyMember } from '~/types/profile';
export default defineComponent({
    name: 'FamilyMemberList',
    components: {
        FamilyMemberDisplay,
    },
    setup() {
        const { t } = useI18n()
        const profileStore = useProfileStore()
        const isLoading = computed(() => profileStore.isLoadingFamilyMembers)
        const isLoaded = computed(() => profileStore.isFamilyMembersLoaded)
        const mockMember: FamilyMember = {
            id: 0,
            name: '---',
            lastName: '---',
            isOnline: false,
            lastSeen: new Date(),
            imageUrl: '',
            isActive: false,
            birthDate: new Date(),
            relation: 'spouse', // any valid relation
            isHeadOfHousehold: false,
            livesWithMe: false,
            userType: ['user'],
        };

        // 2. Computed list: 3 placeholders while loading, real data otherwise
        const members = computed(() => {
            if (!isLoaded.value) {
                return Array.from({ length: 3 }, (_, i) => ({
                    ...mockMember,
                    id: i + 1,
                }));
            }
            return profileStore.familyMembers;
        });

        onMounted(() => {
            if (!profileStore.isFamilyMembersLoaded) {
                profileStore.loadFamilyMembers();
            }
        })


        const addNewMember = () => {

        }

        return {
            isLoading,
            members,
            t,
            addNewMember,
        }
    }
})
</script>