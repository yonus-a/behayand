<template>
    <div class=" w-dvw py-4 px-6 md:max-w-98 flex justify-center">
        <div class=" w-98 flex flex-col select-none text-on-surface gap-y-4">
            <div class=" flex items-center gap-x-3">
                <BIcon icon="PhX" class=" cursor-pointer w-5 h-5 fill-on-surface/50" />
                <div class=" text-label-sm ">{{ t('profile.address.options.add') }}</div>
            </div>
            <AddressMap @request-location-permission="$emit('request-permission')" @map-center="handleMapCenter" />
            <div class=" w-full">
                <BInput autocomplete="off" :title="t('profile.address.form.addressTitle')" :placeholder="t('general.write')"
                    v-model="addressTitle.value" :color="addressTitle.color" :message="addressTitle.message" />
                <div class=" w-full flex items-center gap-x-3">
                    <BSelect :options="provinceOptions" :title="t('profile.address.form.province')"
                        :placeholder="t('general.select')" v-model="chosenProvince.value" :color="chosenProvince.color"
                        :message="chosenProvince.message" />
                    <BSelect :options="cityOptions" :title="t('profile.address.form.city')"
                        :placeholder="t('general.select')" v-model="chosenCity.value" :color="chosenCity.color"
                        :message="chosenCity.message" />
                </div>
                <BInput :title="t('profile.address.form.postalCode')" type="number" :placeholder="t('general.write')"
                    v-model="postalCode.value" :color="postalCode.color" :message="postalCode.message" />
                <BInput autocomplete="street-address" :title="t('profile.address.form.address')" :placeholder="t('general.write')"
                    v-model="addressText.value" :color="addressText.color" :message="addressText.message" />
                <BCheckBox :label="t('profile.address.form.selectAsMain')" v-model="selectAsMain" />
            </div>
            <BButton :text="t('profile.address.submit')" class=" min-w-full" @click="validateFields"
                :disabled="hasErrors" :loading="isSending" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType, ref, computed, watch } from 'vue';
import { useI18n, useAppToast, useLocation } from '#imports';
import type { Address } from '~/types/address';
import citiesData from '~/assets/data/cities.json'
import AddressMap from './AddressMap.vue';
import type { ProvinceWithCities } from '~/types/address';
export default defineComponent({
    name: 'AddressForm',
    props: {
        address: {
            type: Object as PropType<Address>,
            default: () => { }
        }
    },
    components: {
        AddressMap,
    },
    emits: ['close', 'request-permission'],
    setup(props, { emit }) {
        const { t, locale } = useI18n()
        const { openToast } = useAppToast()
        const { findProvinceByName, findCityByName } = useLocation()


        const provinceOptions = computed(() =>
            (citiesData as ProvinceWithCities[]).map(p => ({
                label: p.name,
                value: p.id,
            }))
        )

        const cityOptions = computed(() => {
            const provinceId = chosenProvince.value.value
            if (!provinceId) return []
            const province = (citiesData as ProvinceWithCities[]).find(p => p.id == provinceId)
            return province
                ? province.cities.map(c => ({ label: c.name, value: c.id }))
                : []
        })

        const isSending = ref(false)
        const hasErrors = ref(false)
        const selectAsMain = ref(false)

        const mapCenter = ref<{ lat: number; lng: number } | null>(null)
        const handleMapCenter = (payload: { lat: number; lng: number }) => {
            mapCenter.value = payload
        }

        const addressTitle = ref({
            value: '', color: 'primary', message: ''
        })
        const postalCode = ref({
            value: '', color: 'primary', message: ''
        })
        const addressText = ref({
            value: '', color: 'primary', message: ''
        })

        const chosenProvince = ref({ value: '' as number | string, color: 'primary', message: '' })
        const chosenCity = ref({ value: '' as number | string, color: 'primary', message: '' })

        const validateFields = () => {
            if (hasErrors.value || isSending.value) return

            if (!hasErrors.value) {
                submitAddress()
            }
        }

        const submitAddress = async () => {
            isSending.value = true;
            try {

            } catch (error) {

            } finally {
                isSending.value = false;
            }
        }


        let reverseGeocodeTimer: ReturnType<typeof setTimeout> | null = null

        const cleanAddress = (fullAddress: string) => {
            // Remove postal codes, "Iran" and extra commas (same logic as your old project)
            let temp = fullAddress.replace(/\b\d{5,}(?:-\d+)?\b/g, '')
            temp = temp.replace(/\bایران\b/g, '').replace(/\bIran\b/g, '')
            const parts = temp.split(',').map(p => p.trim()).filter(p => p && p !== '-')
            return parts.join(locale.value === 'fa' ? '، ' : ', ')
        }

        const performReverseGeocode = async () => {
            if (!mapCenter.value) return
            const { lat, lng } = mapCenter.value
            try {
                const lang = locale.value === 'fa' ? 'fa' : 'en'
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang}&addressdetails=1`
                const data = await fetch(url).then(r => r.json())

                if (data && data.display_name) {
                    // 1. Set the address text
                    addressText.value.value = cleanAddress(data.display_name)

                    // 2. Extract province / state
                    const address = data.address || {}
                    const provinceName = address.state || address.province || ''
                    const province = findProvinceByName(provinceName)
                    if (province) {
                        chosenProvince.value.value = province.id
                    }

                    // 3. Extract city
                    const cityName = address.city || address.town || address.village || address.county || ''
                    const city = findCityByName(cityName)
                    if (city) {
                        chosenCity.value.value = city.id
                    } else {
                        // If city not found, keep previous or clear
                        chosenCity.value.value = ''
                    }
                }
            } catch (err) {
                console.warn('Reverse geocode failed:', err)
            }
        }

        // Watch map center with debounce
        watch(mapCenter, () => {
            if (reverseGeocodeTimer) clearTimeout(reverseGeocodeTimer)
            reverseGeocodeTimer = setTimeout(() => {
                performReverseGeocode()
            }, 600)
        })

        return {
            t,
            addressTitle,
            postalCode,
            addressText,
            chosenProvince,
            chosenCity,
            handleMapCenter,
            selectAsMain,
            validateFields,
            hasErrors,
            isSending,
            cityOptions,
            provinceOptions,
        }
    }
})
</script>