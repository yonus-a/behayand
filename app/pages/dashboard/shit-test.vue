<template>
    <div class=" w-full ">
        <div class=" w-full flex select-none flex-col gap-y-6 px-3 md:px-8 py-3 md:py-6">
            <ProfileForm />
            <FamilyMemberList />
            <AddressList />
        </div>
        <Teleport to="#header-custom-actions" v-if="isMobile">
            <NuxtLinkLocale to="/dashboard/profile/settings">
                <BIcon class="w-5 h-5 fill-on-surface cursor-pointer" icon="PhGear" />
            </NuxtLinkLocale>
        </Teleport>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n, useWindowSize } from '#imports';
import DetailsInput from '~/components/profile/DetailsInput.vue';
import ProfileForm from '~/components/profile/ProfileForm.vue';
import AddressList from '~/components/profile/AddressList.vue';
import FamilyMemberList from '~/components/profile/FamilyMemberList.vue';

definePageMeta({
    layout: 'responsive',
    headerTitle: 'seo.dashboard.profile.title',
    layoutTransition: false,
    title: 'seo.dashboard.profile.title',
    showMobileNav: true,
});
export default defineComponent({
    name: 'ProfileView',
    components: {
        ProfileForm,
        DetailsInput,
        FamilyMemberList,
        AddressList,
    },
    setup() {
        const { t } = useI18n()
        const { width } = useWindowSize()
        const isMobile = computed(() => width.value < 768)

        return {
            t,
            isMobile,
        }
    }
})
</script>