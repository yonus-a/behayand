<template>
    <div class=" w-dvw flex justify-center max-w-dvw md:max-w-98">
        <div class=" w-full flex justify-center">
            <div class=" w-full px-6 py-4 max-w-99">
                <div class=" flex items-center gap-x-3 select-none text-on-surface ">
                    <BIcon class=" opacity-50 cursor-pointer w-5 h-5" @click="close" icon="PhX" />
                    <div class=" text-label-sm">{{ t('calendar.form.addEvent') }}</div>
                </div>
                <div class=" w-full mt-4">
                    <BSelect :title="t('calendar.form.type.title')" :placeholder="t('general.select')"
                        :options="eventTypeOptions" v-model="eventType.value" :color="eventType.color"
                        :message="eventType.message" />
                    <BInput :title="t('calendar.form.eventTitle')" :placeholder="t('general.write')"
                        v-model="eventTitle.value" :color="eventTitle.color" :message="eventTitle.message" />

                    <BInput :title="t('calendar.form.descriptions')" :placeholder="t('general.write')"
                        v-model="description.value" :color="description.color" :message="description.message" />
                    <div :class="[eventType.value === 'task' ? 'h-auto opacity-100' : 'opacity-0 h-0']"
                        class=" transition-all duration-200 ease-in-out overflow-hidden text-wrap whitespace-nowrap">
                        <CheckList ref="checkList" />
                    </div>
                    <BSelect :title="t('calendar.form.addPerson')" :placeholder="t('general.select')"
                        v-model="selectedUsers.value" :color="selectedUsers.color" :message="selectedUsers.message"
                        :options="familyOptions" />
                    <div class=" w-full relative">
                        <div id="shit" class="absolute z-20 top-10.5 ltr:right-3 rtl:left-3 w-5 h-5 overflow-visible">
                            <BMenu :options="attachementOptions" @select="removeAttachement">
                                <template #trigger>
                                    <BIcon icon="PhDotsThreeOutline"
                                        class="  w-5 h-5 cursor-pointer text-on-surface " />
                                </template>
                            </BMenu>
                        </div>
                        <BInput v-file-pick="{ onSelect: onImagePick, accept: '.pdf,.doc,.docx,image/*' }" readonly
                            icon="PhPaperclip" :color="attachement.color" :message="attachement.message"
                            v-model="attachement.value" :placeholder="t('general.select')"
                            :title="t('calendar.form.attachement')" />
                    </div>
                    <BSelect v-model="chosenColor.value" :color="chosenColor.color" :message="chosenColor.message"
                        :placeholder="t('general.select')" :title="t('calendar.form.color')" :options="colors" />
                </div>
                <BButton class=" min-w-full w-full" color="primary" type="fill" :text="t('calendar.form.continue')"
                    :disabled="hasErrors" @click="validateFields" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, useTemplateRef } from 'vue';
import { useI18n, useProfileStore } from '#imports';
import type { DropdownOption } from '~/types/components/select';
import CheckList, { type CheckListExposed } from './CheckList.vue';

export default defineComponent({
    name: 'CreateEvent',
    emits: ['close'],
    components: {
        CheckList,
    },
    setup(_, { emit }) {
        const { t } = useI18n()
        const profileStore = useProfileStore()
        const checkListRef = useTemplateRef<CheckListExposed>('checkList');
        const hasErrors = ref(false)

        const colors = computed(() => [
            { label: t('general.colors.red'), value: 'red', color: '#F34040' },
            { label: t('general.colors.orange'), value: 'orange', color: '#F37040' },
            { label: t('general.colors.yellow'), value: 'yellow', color: '#E9EF37' },
            { value: 'green', label: t('general.colors.green'), color: '#8CE25E' },
            { value: 'blueLight', label: t('general.colors.blueLight'), color: '#40F3E4' },
            { value: 'blue', label: t('general.colors.blue'), color: '#555CEE' },
            { value: 'purple', label: t('general.colors.purple'), color: '#CF40F3' },
            { value: 'pink', label: t('general.colors.pink'), color: '#F897F6' },
            { value: 'darkPink', label: t('general.colors.darkPink'), color: '#F49AA6' },
            { value: 'black', label: t('general.colors.black'), color: '#2C2727' },
        ])

        const eventType = ref({ value: 'task', message: '', color: 'primary' })
        const eventTitle = ref({ value: '', message: '', color: 'primary' })
        const description = ref({ value: '', message: '', color: 'primary' })
        const selectedUsers = ref({ value: [], message: '', color: 'primary' })
        const attachement = ref({ value: '', color: '', message: '' })
        const chosenColor = ref({ value: colors.value[0]?.value, message: '', color: 'primary' })


        const attachementOptions = computed(() => [{ key: 'delete', icon: 'PhTrash', color: 'error', label: t('calendar.form.deleteAttachement') }])


        watch(() => eventType.value.value, () => {
            console.log('val:', eventType.value.value)
        })


        const attachementsTitles = computed(() => '')

        const removeAttachement = () => {
            attachement.value.value = ''
        }


        const familyOptions = computed((): DropdownOption[] => {
            return (profileStore.familyMembers || [])
                .map((member) => ({
                    label: `${member.name} ${member.lastName}`.trim(),
                    value: member.id,
                    image: member.imageUrl || '/images/no-avatar.webp',
                }));
        });

        const MAX_FILE_SIZE_MB = 5;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
        const ALLOWED_TYPES = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/webp'
        ];


        const onImagePick = (files: any[]) => {
            if (!files || files.length === 0) return;

            const { file, path } = files[0];

            attachement.value.message = '';
            attachement.value.color = 'primary';
            hasErrors.value = false;

            if (!ALLOWED_TYPES.includes(file.type)) {
                attachement.value.color = 'error';
                attachement.value.message = t('suggestions.invalidFormat');
                attachement.value.value = '';
                hasErrors.value = true;
                return;
            }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                attachement.value.color = 'error';
                attachement.value.message = t('suggestions.invalidFileSize', { size: `${MAX_FILE_SIZE_MB}MB` });
                attachement.value.value = '';
                hasErrors.value = true;
                return;
            }

            attachement.value.value = file.name;
        };


        const eventTypeOptions = computed(() => [
            {
                label: t('calendar.form.type.task'),
                value: 'task'
            },
            {
                label: t('calendar.form.type.medicine'),
                value: 'medicine'
            },
            {
                label: t('calendar.form.type.event'),
                value: 'event'
            },
            //  {
            //      label: t('calendar.form.type.service'),
            //      value: 'service'
            //  },
        ])


        const validateFields = () => {
            if (hasErrors.value) return

            if (eventType.value.value === 'task') {
                if (checkListRef.value?.validate()) {
                    hasErrors.value = true
                }
            }

            if (!hasErrors.value) {
                submitFields()
            }
        }

        const submitFields = () => {

        }


        const close = () => {
            emit('close')
        }

        return {
            t,
            eventTypeOptions,
            checkListRef,
            colors,
            close,
            eventType,
            familyOptions,
            eventTitle,
            attachementOptions,
            removeAttachement,
            attachement,
            description,
            selectedUsers,
            onImagePick,
            attachementsTitles,
            hasErrors,
            chosenColor,
            validateFields,
        }
    }
})
</script>