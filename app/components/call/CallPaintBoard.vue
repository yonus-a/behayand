<template>
    <div
        class="whitespace-nowrap md:h-142.5 text-wrap max-h-140 h-[65vw] select-none w-dvw max-w-135 flex flex-col p-4">
        <div class="flex items-center gap-x-3 shrink-0">
            <BIcon icon="PhX" class="cursor-pointer fill-on-surface/50 w-5 h-5" @click="$emit('close')" />
            <div class="text-on-surface text-label-sm">{{ t('chat.board.title') }}</div>
        </div>

        <!-- CANVAS WRAPPER -->
        <div class="flex-1 w-full border-2 rounded-2xl border-primary mt-4 relative overflow-hidden bg-white">
            <canvas ref="canvasRef" class="w-full h-full absolute top-0 left-0 touch-none"></canvas>
        </div>

        <div class="flex items-center justify-between mt-2 shrink-0">
            <BButton icon="PhTrayArrowDown" color="primary" type="fill" @click="saveToFiles" />
            <div dir="rtl" class="flex items-center gap-x-2">
                <!-- Color Picker (You can attach an input type="color" or a menu here later) -->
                <div @click="handleAction('color')"
                    class="aspect-square w-11 rounded-full flex items-center justify-center cursor-pointer bg-surface-variant relative overflow-hidden">
                    <input type="color" v-model="selectedColor" class="absolute opacity-0 w-20 h-20 cursor-pointer" />
                    <div class="rounded-full aspect-square w-6 h-6 pointer-events-none"
                        :style="{ backgroundColor: selectedColor }"></div>
                </div>

                <!-- VERTICAL BRUSH SIZE SLIDER IN BMENU -->
                <BMenu align="top" :autoClose="false">
                    <template #trigger="{ isOpen }">
                        <div class="aspect-square w-11 rounded-full flex items-center justify-center cursor-pointer bg-surface-variant"
                            :class="[isOpen ? 'ring-2 ring-primary' : '']">
                            <BIcon icon="PhPencilLine" class="w-6 h-6 fill-on-surface" />
                        </div>
                    </template>

                    <!-- @click.stop prevents the BPopup from closing when you click the menu -->
                    <div class="py-2" @click.stop @pointerdown.stop>
                        <BrushSizeSlider v-model="brushSize" :color="selectedColor" />
                    </div>
                </BMenu>
                <div @click="handleAction('redo')"
                    class="aspect-square w-11 rounded-full flex items-center justify-center cursor-pointer bg-surface-variant">
                    <BIcon icon="PhArrowUUpRight" class="w-6 h-6 fill-on-surface" />
                </div>
                <div @click="handleAction('undo')"
                    class="aspect-square w-11 rounded-full flex items-center justify-center cursor-pointer bg-surface-variant">
                    <BIcon icon="PhArrowUUpLeft" class="w-6 h-6 fill-on-surface" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useI18n } from '#imports';
import BrushSizeSlider from './BrushSizeSlider.vue';

export default defineComponent({
    name: 'CallPaintBoardContent',
    emits: ['close'],
    components: {
        BrushSizeSlider,
    },
    setup() {
        const { t } = useI18n();

        // State
        const canvasRef = ref<HTMLCanvasElement | null>(null);
        let signaturePadInstance: any = null;

        const selectedColor = ref('#000000');
        const brushSize = ref(3);

        // History for Undo/Redo
        const history = ref<any[]>([]);
        const redoHistory = ref<any[]>([]);

        // Handle Canvas Resizing correctly to prevent stretching
        const resizeCanvas = () => {
            const canvas = canvasRef.value;
            if (!canvas) return;
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d")?.scale(ratio, ratio);

            // Restore drawing after resize
            if (signaturePadInstance && history.value.length > 0) {
                signaturePadInstance.fromData(history.value);
            }
        };

        onMounted(async () => {
            // Dynamic import to prevent Nuxt SSR crashing
            const SignaturePadModule = await import('signature_pad');
            const SignaturePad = SignaturePadModule.default;

            if (canvasRef.value) {
                signaturePadInstance = new SignaturePad(canvasRef.value, {
                    minWidth: brushSize.value,
                    maxWidth: brushSize.value + 2,
                    penColor: selectedColor.value,
                    backgroundColor: 'rgb(255, 255, 255)' // Required for clean JPEG saving
                });

                resizeCanvas();
                window.addEventListener("resize", resizeCanvas);

                // Save stroke to history array when user finishes drawing a line
                signaturePadInstance.addEventListener("endStroke", () => {
                    history.value = signaturePadInstance.toData();
                    redoHistory.value = []; // Clear redo stack on new drawing
                });
            }
        });

        onBeforeUnmount(() => {
            window.removeEventListener("resize", resizeCanvas);
            if (signaturePadInstance) {
                signaturePadInstance.off();
            }
        });

        // Reactively update pad settings
        watch(brushSize, (newSize) => {
            if (signaturePadInstance) {
                signaturePadInstance.minWidth = newSize;
                signaturePadInstance.maxWidth = newSize + 2;
            }
        });

        watch(selectedColor, (newColor) => {
            if (signaturePadInstance) {
                signaturePadInstance.penColor = newColor;
            }
        });

        const saveToFiles = () => {
            if (!signaturePadInstance || signaturePadInstance.isEmpty()) return;

            // Save as JPEG (which relies on the backgroundColor we set to white)
            const dataUrl = signaturePadInstance.toDataURL("image/jpeg");

            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `drawing-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        const handleAction = (action: string) => {
            if (!signaturePadInstance) return;

            switch (action) {
                case 'undo':
                    if (history.value.length > 0) {
                        const lastAction = history.value.pop();
                        redoHistory.value.push(lastAction);
                        signaturePadInstance.fromData(history.value);
                    }
                    break;
                case 'redo':
                    if (redoHistory.value.length > 0) {
                        const nextAction = redoHistory.value.pop();
                        history.value.push(nextAction);
                        signaturePadInstance.fromData(history.value);
                    }
                    break;
            }
        };

        return {
            t,
            canvasRef,
            saveToFiles,
            selectedColor,
            brushSize,
            handleAction,
        };
    }
})
</script>
