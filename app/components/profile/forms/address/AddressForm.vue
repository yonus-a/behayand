<template>
    <div>Form Bitch</div>
</template>
<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { useI18n } from '#imports';
import type { Address } from '~/types/address';
export default defineComponent({
    name: 'AddressForm',
    props: {
        address: {
            type: Object as PropType<Address>,
            default: () => { }
        }
    },
    setup(props, { emit }) {
        const { t } = useI18n()


        return {
            t,
        }
    }
})
</script>