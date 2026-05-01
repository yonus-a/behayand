<template>
    <!-- MOBILE (< 1024px): Trigger + Popup -->
    <!--
    -->

    <BPopup ref="popupRef">
        <MedicSelectorContent @close="closeAll" />
    </BPopup>
    <!-- DESKTOP (>= 1024px): Trigger + Menu -->
    <BMenu ref="menuRef" :options="options" @select="handleSelect" @close="resetMenuMode">
        <template #trigger>
            <slot name="trigger" />
        </template>
        <div class="p-1" v-if="internalMenuMode === 'medic'">
            <!-- If we have options, only show content after 'add-user' is clicked -->
            <div v-if="internalMenuMode === 'medic' || !options.length">
                <MedicSelectorContent @close="closeAll" />
            </div>
        </div>
    </BMenu>
</template>

<script lang="ts">
import { defineComponent, computed, ref, type PropType } from 'vue';
import { useWindowSize, useI18n } from '#imports';
import type { Popup } from '~/types/components/popup';
import type { Menu } from '~/types/components/menu';
import type { MenuOption } from '~/types/components/menu-options';
import MedicSelectorContent from './MedicSelectorContent.vue';

export default defineComponent({
    name: 'MedicSelector',
    props: {
        mode: {
            type: String as PropType<'medic' | 'options'>,
            default: 'medic'
        },
        // If provided, the desktop menu shows these first
        options: { type: Array as PropType<MenuOption[]>, default: () => [] }
    },
    components: { MedicSelectorContent },
    emits: ['select'], // Notify parent if a standard menu option is clicked
    setup(props, { emit }) {
        const { t } = useI18n();
        const popupRef = ref<Popup | null>(null);
        const menuRef = ref<Menu | null>(null);
        const { width } = useWindowSize();
        const isTransitioning = ref(false)

        const internalMenuMode = ref<'options' | 'medic'>('options');
        const isMobile = computed(() => width.value < 1024);

        const openPopup = () => {
            if (props.mode === 'medic') {
                popupRef.value?.open()
            }
        };

        //const handleSelect = (key: string) => {
        //    if (key === 'add-user') {
        //        internalMenuMode.value = 'medic';
        //    } else {
        //        emit('select', key);
        //        closeAll();
        //    }
        //};


        const handleSelect = (key: string) => {
            if (key === 'add-user') {
                if (!isMobile.value) {
                    isTransitioning.value = true;
                    menuRef.value?.close();
                    setTimeout(() => {
                        internalMenuMode.value = 'medic';
                        setTimeout(() => {
                            menuRef.value?.open();
                            isTransitioning.value = false;
                        }, 200);
                    }, 200)
                } else {
                    popupRef.value?.open()
                }
            } else {
                emit('select', key);
                closeAll();
            }
        };

        const resetMenuMode = () => {
            if (isTransitioning.value) return
            setTimeout(() => {
                internalMenuMode.value = 'options'
            }, 300);
        };

        const closeAll = () => {
            popupRef.value?.close();
            menuRef.value?.close();
        };

        return { isMobile, popupRef, menuRef, openPopup, closeAll, t, internalMenuMode, handleSelect, resetMenuMode };
    }
});
</script>