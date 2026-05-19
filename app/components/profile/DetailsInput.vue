<template>
    <div v-loading="isLoading"
        class=" cursor-pointer select-none text-on-surface  bg-surface-variant py-2 px-3 flex flex-col gap-y-1 rounded-xl">
        <div class="  text-body-sm opacity-50">{{ field.title }}</div>
        <div v-if="field && field.value?.trim().length > 0" class=" text-label-md">{{ field.value }}</div>
        <div v-else-if="field" class=" text-label-md text-primary flex items-center gap-x-2">
            <BIcon icon="PhPlus" class=" w-5 h-5" />
            <div>{{ t('profile.profile.enterPlaceholder', { field: field.title }) }}</div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useI18n } from '#imports';
export interface ProfileFieldProps {
    id: string;
    title: string;
    value: string | null;
}
export default defineComponent({
    name: 'DetailsInput',
    props: {
        field: {
            type: Object as PropType<ProfileFieldProps>,
            required: true
        },
        loading: {
            type: Boolean,
            default: true,
        }
    },
    setup(props) {
        const { t } = useI18n()
        const isLoading = computed(() => props.loading)


        return {
            t,
            isLoading,
        }
    }
})

</script>