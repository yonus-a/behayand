<template>
    <div class=" w-full select-none rounded-2xl flex flex-col gap-y-4 p-4 border border-outline-variant">
        <div class=" text-on-surface text-title-sm">{{ t('profile.familyMembers.title') }}</div>
        <div class=" w-full flex flex-col gap-y-3 ">
            <FamilyMemberDisplay v-for="member in members" :key="member.id" :member="member" />
            <div @click="addNewMember"
                class=" cursor-pointer bg-surface-variant h-18 px-3 rounded-xl flex items-center gap-x-2 text-primary">
                <BIcon icon="PhPlus" class="w-5 h-5" />
                <div class=" text-label-md">{{ t('profile.familyMembers.addFamilyMember') }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n, useProfileStore } from '#imports';
import FamilyMemberDisplay from './list-items/FamilyMemberDisplay.vue';

export default defineComponent({
    name: 'FamilyMemberList',
    components: {
        FamilyMemberDisplay,
    },
    setup() {
        const { t } = useI18n()
        const profileStore = useProfileStore()
        const isLoading = computed(() => profileStore.isLoadingFamilyMembers)
        const members = computed(() => profileStore.familyMembers)

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