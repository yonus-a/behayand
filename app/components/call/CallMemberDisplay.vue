<template>
    <div class=" w-full h-full relative rounded-2xl p-2 flex flex-col bg-black-600 gap-y-2 items-center border justify-center transition-all duration-200 ease-in-out"
        :class="[isSpeaking ? ' border-primary' : ' border-primary/0']">
        <div class=" absolute p-2 w-full h-full z-10 top-0 left-0  flex flex-col justify-between" @click.self.stop>
            <div class=" w-full flex justify-end items-center">
                <div class="cursor-pointer rounded-full bg-black-500 w-10 h-10 flex items-center justify-center">
                    <BIcon icon="PhWaveform" class=" w-4 h-4 fill-white" />
                </div>
            </div>
            <div class=" w-full flex items-center">
                <div class=" rounded-full w-10 h-10 flex items-center cursor-pointer justify-center bg-black-500">
                    <BIcon icon="PhFrameCorners" class="  w-4 h-4 fill-white" />
                </div>
            </div>
        </div>
        <div class=" w-18 h-18">
            <ContactAvatar :contact="contact" />
        </div>
        <div class=" text-white text-label-md sm:text-title-lg select-none">{{ contact.name }} {{ contact.lastName }}</div>
    </div>
</template>
<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import type { Contact } from '~/types/chat';
import ContactAvatar from '../chat/contact/ContactAvatar.vue';

export default defineComponent({
    name: 'CallMemberDisplay',
    props: {
        contact: {
            type: Object as PropType<Contact>,
            required: true,
        }
    },
    components: {
        ContactAvatar,
    },
    setup(props) {

        const isSpeaking = ref(false)


        return {
            isSpeaking,
        }
    }
})
</script>