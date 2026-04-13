<template>
    <BPopup no-padding ref="popup" @closed="resetState">
        <div v-if="mode === 'select'" v-image-picker="handleImageSelected"
            class="cursor-pointer w-full border p-3 border-border-dark-low dark:border-border-light-low flex-col border-dashed flex justify-center items-center max-w-121 rounded-2xl">
            <BIcon icon="PhCamera" class="fill-text-light-low dark:fill-text-dark-low w-7 h-7" />
            <div
                class="mt-2 w-full text-center text-text-light-high dark:text-text-dark-high select-none font-bold text-lg">
                {{ t('models.addImage') }}
            </div>
            <div class="w-full text-center text-base text-text-light-low dark:text-text-dark-low select-none">
                {{ t('models.clickOrDrag') }}
            </div>
            <div class="w-full text-center text-sm text-text-light-low dark:text-text-dark-low select-none">
                {{ t('models.maxImageSize', { size: toPersianNumbers(maxSize) }) }}
            </div>
        </div>

        <div v-if="mode === 'crop'" class="flex flex-col w-full md:w-120 max-w-full ">
            <div class=" w-full border-b border-b-outline-variant p-5 flex items-center gap-x-3">
                <BIcon class=" cursor-pointer fill-on-surface/50 w-7 h-7" icon="PhX" @click="closePopup" />
                <div class=" text-label-md select-none text-on-surface">{{ t('auth.profile.imageCrop') }}</div>
            </div>
            <div class=" w-full p-5">
                <div
                    class="w-full  h-75 sm:h-100 bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden relative">
                    <Cropper ref="cropperRef" class="w-full h-full" :src="imageUrl" :stencil-component="CircleStencil"
                        :stencil-props="{ aspectRatio: 1 }" :canvas="{ maxWidth: 1024, maxHeight: 1024 }"
                        image-restriction="fit-area" :auto-zoom="true" :transitions="!isSliderActive"
                        @change="onCropperChange" />
                </div>

                <div class="flex items-center gap-x-3 mt-3 select-none">
                    <div @click="rotate"
                        class="w-10 h-10 shrink-0 flex items-center justify-center bg-transparent cursor-pointer rounded-full hover:bg-greyscale-50 dark:hover:bg-neutral-900 transition-colors">
                        <BIcon icon="PhArrowCounterClockwise" class="w-6 h-6 fill-on-surface " />
                    </div>
                    <div @click="flipImage"
                        class="w-10 h-10 shrink-0 flex items-center justify-center bg-transparent cursor-pointer rounded-full hover:bg-greyscale-50 dark:hover:bg-neutral-900 transition-colors">
                        <BIcon icon="PhFlipHorizontal" class="w-6 h-6 fill-on-surface " />
                    </div>
                    <div
                        class="flex-1 flex items-center bg-surface-variant rounded-xl h-9 ltr:pl-1 ltr:pr-2 rtl:pl-2 rtl:pr-1 overflow-hidden">


                        <div :dir="locale === 'en' ? 'ltr' : 'rtl'"
                            class="flex-1 flex items-center h-full relative mx-3 ruler-container cursor-grab active:cursor-grabbing"
                            style="mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);"
                            @pointerdown="startRulerDrag" @pointermove.prevent="onRulerDrag" @pointerup="endRulerDrag"
                            @pointerleave="endRulerDrag" @pointercancel="endRulerDrag"
                            :style="{ backgroundPositionX: rulerBackgroundPosition + 'px' }">
                            <div
                                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-4.5 z-10 pointer-events-none">
                                <svg width="8" height="22" viewBox="0 0 8 22" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path class="ruler-thumb-path" d="M0 0H8L5 6V16L8 22H0L3 16V6Z" />
                                </svg>
                            </div>
                        </div>
                        <BIcon icon="PhMagnifyingGlass" class="w-6 h-6 fill-on-surface/50 shrink-0" />
                    </div>


                </div>

                <div class="hidden">
                    <BButton size="sm" @click="flip" />
                    <BButton size="sm" @click="undo" />
                    <BButton size="sm" @click="redo" />
                    <BButton size="lg" @click="closePopup" />
                </div>


            </div>
            <div class="w-full border-t border-t-outline-variant mt-3 p-5">
                <BButton @click="cropImage" color="primary" variant="fill" :text="t('auth.profile.confirm')"
                    class="min-w-full h-12 text-lg rounded-xl" />
            </div>
        </div>
    </BPopup>
    <DToast ref="toast" />
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from '#imports';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import type { Popup } from '~/types/components/popup';

const emit = defineEmits(['cropped']);

const { t, locale } = useI18n();
const popup = ref<Popup | null>(null);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);

const mode = ref<'select' | 'crop'>('select');
const maxSize = ref(5);
const imageUrl = ref('');
const rawFile = ref<File | null>(null);

const zoomSlider = ref(1);
const minZoomAllowed = ref(0.1);
const maxZoomAllowed = ref(5);
const isSliderActive = ref(false);
let initializedBounds = false;

// --- CUSTOM SCROLLING RULER LOGIC (POINTER EVENTS) ---
const isRulerDragging = ref(false);
const dragStartX = ref(0);
const dragStartZoom = ref(1);
const zoomSpeed = 0.01;
let dragRAF: number | null = null;

const rulerBackgroundPosition = computed(() => {
    const multiplier = locale.value === 'en' ? -1 : 1;
    return (zoomSlider.value / zoomSpeed) * multiplier;
});

const startRulerDrag = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);

    isRulerDragging.value = true;
    isSliderActive.value = true;
    dragStartX.value = e.clientX;
    dragStartZoom.value = zoomSlider.value;
};

const onRulerDrag = (e: PointerEvent) => {
    if (!isRulerDragging.value) return;

    const currentX = e.clientX;
    const deltaX = currentX - dragStartX.value;
    const dirMultiplier = locale.value === 'en' ? 1 : -1;

    let targetZoom = dragStartZoom.value - (deltaX * zoomSpeed * dirMultiplier);

    if (targetZoom < minZoomAllowed.value) targetZoom = minZoomAllowed.value;
    if (targetZoom > maxZoomAllowed.value) targetZoom = maxZoomAllowed.value;

    zoomSlider.value = targetZoom;

    if (dragRAF) cancelAnimationFrame(dragRAF);
    dragRAF = requestAnimationFrame(() => {
        if (cropperRef.value) {
            const { image, coordinates } = cropperRef.value.getResult();
            if (image && coordinates && coordinates.width > 0) {
                const currentActualZoom = image.width / coordinates.width;
                const factor = targetZoom / currentActualZoom;
                if (factor !== 1) cropperRef.value.zoom(factor);
            }
        }
    });
};

const endRulerDrag = (e: PointerEvent) => {
    if (!isRulerDragging.value) return;
    isRulerDragging.value = false;
    isSliderActive.value = false;

    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
    }

    if (cropperRef.value) {
        const { image, coordinates } = cropperRef.value.getResult();
        if (image && coordinates && coordinates.width > 0) {
            zoomSlider.value = image.width / coordinates.width;
        }
    }
    setTimeout(() => { saveState(); }, 50);
};

// --- UNDO / REDO STATE ---
interface CropperHistoryState {
    coordinates: any;
    rotate: number;
    flipH: boolean;
    zoom: number;
}
const history = ref<CropperHistoryState[]>([]);
const currentIndex = ref(-1);
const currentRotation = ref(0);
const currentFlipH = ref(false);
const isUndoRedoAction = ref(false);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let undoRedoTimer: ReturnType<typeof setTimeout> | null = null;

const isLastStep = computed(() => currentIndex.value >= history.value.length - 1);
const isFirstStep = computed(() => currentIndex.value <= 0);

const saveState = () => {
    if (isUndoRedoAction.value || !cropperRef.value) return;

    const result = cropperRef.value.getResult();
    const finalCoords = result?.coordinates;

    if (!finalCoords || finalCoords.width === 0) return;

    const image = result?.image;
    const zoom = (image && finalCoords.width > 0) ? image.width / finalCoords.width : zoomSlider.value;

    const currentState = history.value[currentIndex.value];
    if (currentState) {
        const isSame =
            Math.abs(currentState.coordinates.width - finalCoords.width) < 2 &&
            Math.abs(currentState.coordinates.height - finalCoords.height) < 2 &&
            Math.abs(currentState.coordinates.left - finalCoords.left) < 2 &&
            Math.abs(currentState.coordinates.top - finalCoords.top) < 2 &&
            currentState.rotate === currentRotation.value &&
            currentState.flipH === currentFlipH.value;

        if (isSame) return;
    }

    if (currentIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, currentIndex.value + 1);
    }

    history.value.push({
        coordinates: JSON.parse(JSON.stringify(finalCoords)),
        rotate: currentRotation.value,
        flipH: currentFlipH.value,
        zoom: zoom
    });
    currentIndex.value++;
};

const applyState = async (state: CropperHistoryState) => {
    if (!cropperRef.value) return;
    isUndoRedoAction.value = true;

    const rotateDiff = state.rotate - currentRotation.value;
    let needsTick = false;

    if (rotateDiff !== 0) {
        cropperRef.value.rotate(rotateDiff);
        currentRotation.value = state.rotate;
        needsTick = true;
    }

    if (state.flipH !== currentFlipH.value) {
        cropperRef.value.flip(true, false);
        currentFlipH.value = state.flipH;
        needsTick = true;
    }

    if (needsTick) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    cropperRef.value.setCoordinates(JSON.parse(JSON.stringify(state.coordinates)));
    zoomSlider.value = state.zoom;

    if (undoRedoTimer) clearTimeout(undoRedoTimer);
    undoRedoTimer = setTimeout(() => {
        isUndoRedoAction.value = false;
    }, 600);
};

const undo = () => {
    if (isFirstStep.value) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    currentIndex.value--;
    applyState(history.value[currentIndex.value]);
};

const redo = () => {
    if (isLastStep.value) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    currentIndex.value++;
    applyState(history.value[currentIndex.value]);
};

const openPopup = (file?: File, path?: string) => {
    resetState();
    if (file && path) {
        rawFile.value = file;
        imageUrl.value = path;
        initializedBounds = false;
        mode.value = 'crop';
    } else {
        mode.value = 'select';
    }
    popup.value?.open();
};

const closePopup = () => {
    popup.value?.close();
    setTimeout(() => { resetState(); }, 300);
};
defineExpose({ openPopup, closePopup });

const handleImageSelected = (path: string, file: File) => {
    const maxSizeInBytes = maxSize.value * 1024 * 1024;
    if (file.size > maxSizeInBytes) return;

    rawFile.value = file;
    if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = URL.createObjectURL(file);

    initializedBounds = false;
    mode.value = 'crop';
};

const resetState = () => {
    mode.value = 'select';
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
        imageUrl.value = '';
    }
    rawFile.value = null;

    zoomSlider.value = 1;
    minZoomAllowed.value = 0.1;
    maxZoomAllowed.value = 5;
    initializedBounds = false;
    isSliderActive.value = false;
    isRulerDragging.value = false;

    history.value = [];
    currentIndex.value = -1;
    currentRotation.value = 0;
    currentFlipH.value = false;
    isUndoRedoAction.value = false;
    if (dragRAF) cancelAnimationFrame(dragRAF);
    if (debounceTimer) clearTimeout(debounceTimer);
    if (undoRedoTimer) clearTimeout(undoRedoTimer);
};

const rotate = () => {
    if (cropperRef.value) {
        cropperRef.value.rotate(90);
        currentRotation.value = (currentRotation.value + 90) % 360;
        if (debounceTimer) clearTimeout(debounceTimer);
        setTimeout(() => { saveState(); }, 500);
    }
};

const flip = () => {
    if (cropperRef.value) {
        cropperRef.value.flip(true, false);
        currentFlipH.value = !currentFlipH.value;
        if (debounceTimer) clearTimeout(debounceTimer);
        setTimeout(() => { saveState(); }, 500);
    }
};

const onCropperChange = ({ coordinates, image }: any) => {
    if (image && coordinates && coordinates.width > 0) {
        const currentZoom = image.width / coordinates.width;

        if (!initializedBounds) {
            minZoomAllowed.value = currentZoom;
            maxZoomAllowed.value = currentZoom * 4;
            initializedBounds = true;
            zoomSlider.value = currentZoom;

            setTimeout(() => { saveState(); }, 150);
        } else {
            if (currentZoom < minZoomAllowed.value) {
                minZoomAllowed.value = currentZoom;
            }
            if (!isSliderActive.value && !isUndoRedoAction.value) {
                zoomSlider.value = currentZoom;
            }
        }

        if (!isSliderActive.value && !isUndoRedoAction.value) {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => { saveState(); }, 500);
        }
    }
};

const cropImage = () => {
    if (cropperRef.value) {
        const { canvas } = cropperRef.value.getResult();
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob && rawFile.value) {
                    const croppedFile = new File([blob], rawFile.value.name, {
                        type: blob.type,
                    });
                    emit('cropped', croppedFile, URL.createObjectURL(blob));
                    closePopup();
                }
            }, rawFile.value?.type || 'image/jpeg');
        }
    }
};

onUnmounted(() => {
    if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
});
const flipImage = () => {
    if (cropperRef.value) {
        cropperRef.value.flip(true, false);
        currentFlipH.value = !currentFlipH.value;
        if (debounceTimer) clearTimeout(debounceTimer);
        setTimeout(() => { saveState(); }, 500);
    }
};
</script>

<style scoped>
/* Circular Mask & 30% Black Overlay */
:deep(.vue-advanced-cropper__foreground) {
    background-color: rgba(0, 0, 0, 0.3) !important;
    cursor: grab !important;
}

:deep(.vue-advanced-cropper__foreground:active) {
    cursor: grabbing !important;
}

/* Transparent Handles with Grayscale-0 Borders */
:deep(.vue-simple-handler) {
    background-color: transparent !important;
    border: 2px solid var(--color-greyscale-0, #ffffff) !important;
}

/* * The mathematical fix for the double big line bug: 
 * We set background-size to 800px. This is exactly divisible by 10px (small gaps) 
 * and 80px (big gaps), meaning when the background repeats infinitely, it connects flawlessly.
 */
.ruler-container {
    touch-action: none;
    background-color: transparent;
    background-image:
        repeating-linear-gradient(to right, var(--color-outline) 0px, var(--color-outline) 2px, transparent 2px, transparent 80px),
        repeating-linear-gradient(to right, var(--color-outline-variant) 0px, var(--color-outline-variant) 2px, transparent 2px, transparent 10px);
    background-size: 800px 16px, 800px 10px;
    background-position-y: center;
    background-repeat: repeat-x;
}

/* Color binding for the SVG thumb */
.ruler-thumb-path {
    fill: var(--color-primary);
}

:global(.dark) .ruler-thumb-path {
    fill: var(--color-primary);
}

/* Clean up internal cropper lines to look modern */
:deep(.vue-simple-line) {
    border-color: rgba(255, 255, 255, 0.4) !important;
    border-style: solid !important;
}
</style>