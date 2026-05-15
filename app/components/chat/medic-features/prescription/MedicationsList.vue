<template>
    <div class=" max-w-1/2 w-102 h-full"></div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { PrescribedMedication } from '~/types/medication';

export default defineComponent({
    name: 'MedicationsList',
    props: {
        medications: {
            type: Array as PropType<PrescribedMedication[]>,
            default: () => []
        },
    },
    setup(props) {



        return {

        }
    }
})
</script>