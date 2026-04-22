<template>
    <div class=" px-6 h-19 w-full bg-surface flex items-center border-t border-t-outline-variant gap-x-5">
        <BIcon :class="[iconClass]"
            icon="PhMicrophone" class=" cursor-pointer w-6 h-6 fill-on-surface shrink-0" />
        <input :disabled="!inputDisabled" type="text" :placeholder="inputPlaceholder"
            class=" text-body-md text-on-surface outline-none flex-1">
        <div class=" shrink-0 flex items-center gap-x-8"
            :class="[iconClass]">
            <BIcon icon="PhSmiley" class=" cursor-pointer w-6 h-6 fill-on-surface shrink-0" />
            <BIcon icon="PhPaperclipHorizontal" class=" -rotate-90 cursor-pointer w-6 h-6 fill-on-surface shrink-0" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from '#imports';
export default defineComponent({
    name: 'ChatInput',
    props: {
        isActive: {
            type: Boolean,
            default: false,
        }
    },
    setup(props) {
        const { t } = useI18n()
        const inputDisabled = computed(() => !props.isActive)
        const inputPlaceholder = computed(() => !props.isActive ? t('chat.placeholder') : t('chat.chatLocked'))
        const iconClass = computed(() => !inputDisabled.value ? ' opacity-50 pointer-events-none' : ' opacity-100 pointer-events-auto')


        onMounted(() => {
            console.log(inputDisabled.value)
        })

        return {
            t,
            inputDisabled,
            inputPlaceholder,
            iconClass,
        }
    }
})
</script>