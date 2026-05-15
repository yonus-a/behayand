<template>
    <div class=" w-full rounded-xl cursor-pointer transition-all duration-200 ease-in-out flex gap-x-2 group p-2.5 items-center "
        :class="[isSelected ? 'bg-primary/10' : ' bg-surface-variant/0 hover:bg-surface-variant-2']">
        <div class="rounded-full overflow-hidden w-5 h-5 flex items-center justify-center shrink-0 border border-outline/10"
            :class="[!isSelected && locale.code !== 'fa' ? 'bg-primary/5' : '']">
            <BImage v-if="locale.code === 'fa'" class="min-w-[110%] scale-110 max-w-[110%] w-[110%] max-h-[110%] min-h-[110%] h-[110%]"
                :src="locale.flag" />
            <span v-else class="text-[8px] font-bold text-primary uppercase leading-none">
                {{ locale.code }}
            </span>
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