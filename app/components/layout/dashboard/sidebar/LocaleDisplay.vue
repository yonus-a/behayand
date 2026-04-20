<template>
    <div class=" w-full rounded-xl cursor-pointer transition-all duration-200 ease-in-out flex gap-x-2 group p-2.5 items-center "
        :class="[isSelected ? 'bg-primary/10' : ' bg-surface-variant/0 hover:bg-surface-variant-2']">
        <div class=" rounded-full  overflow-hidden w-5 h-5">
            <BImage class=" min-w-full max-w-full w-full max-h-full min-h-full h-full" :src="locale.flag" />
        </div>
        <div class=" select-none  text-body-sm transition-all duration-200 ease-in-out"
            :class="[isSelected ? 'text-primary' : 'text-on-surface/70 group-hover:text-on-surface']">{{ locale.title }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
export interface Locale {
    code: string;
    iso: string;
    dir: 'ltr' | 'rtl';
    language: string;
    title: string;
    countryCode: string;
    flag: string;
}

export default defineComponent({
    name: 'LocaleDisplay',
    props: {
        locale: {
            type: Object as PropType<Locale>,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        }
    }
})
</script>