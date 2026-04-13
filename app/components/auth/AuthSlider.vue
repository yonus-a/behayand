<template>
    <div class=" w-full h-full flex justify-center items-center"></div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useI18n } from '#imports';
import { useLocale } from '#imports';
import loginImage from '/images/auth/login.webp'
import registerImage from '/images/auth/register.webp'
import verifyImage from '/images/auth/register.webp'
import profileImage from '/images/auth/profile.webp'
import { useRoute } from 'vue-router';
export default defineComponent({
    name: 'AuthSlider',
    setup() {
        const route = useRoute()
        const { t } = useI18n()

        const slideTexts = computed(() => [
            t('auth.slides.slide1'),
            t('auth.slides.slide2'),
            t('auth.slides.slide3'),
            t('auth.slides.slide4'),
            t('auth.slides.slide5'),
            t('auth.slides.slide6'),
        ])


        return {

        }
    }
})
</script>