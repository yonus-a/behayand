<template>
    <div class="w-full flex flex-col gap-y-4 bg-surface border border-surface-variant rounded-3xl py-4 overflow-hidden">
        <div class="w-full px-4 flex justify-between items-center">
            <div v-loading="isLoading" class="text-title-sm select-none text-on-surface font-bold">{{ cardTitle }}</div>
        </div>

        <div :class="[type === 'all' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto']"
            class="w-full px-4">
            <div class="flex items-center gap-x-2 w-full">
                <BLabel v-loading="isLoading" @click="idk" size="sm" class="translate-y-0.5 cursor-pointer shrink-0" icon="PhPlus" />
                <div v-desktop-scroll
                    class="flex-1 min-w-0 flex items-center gap-x-2 overflow-x-auto hide-scrollbar whitespace-nowrap py-1">
                    <BLabel v-loading="isLoading" v-for="status in cardFinalProps" :key="status.key" color="neutral" type="ghost" size="sm"
                        class="shrink-0 pointer-events-none" :icon="status.icon" :text="status.label" />
                </div>
            </div>
        </div>

        <div class="flex items-end justify-between px-4 mt-2">
            <div class="flex flex-col gap-y-1">
                <div v-loading="isLoading" class="text-head-sm font-bold">
                    {{ t(`dashboard.cards.status.${healthState}`) }}
                </div>

                <div class="flex items-center gap-x-2 text-body-sm text-on-surface/50">
                    <span v-loading="isLoading" class="select-none">{{ t('dashboard.cards.total') }}</span>
                    <span class="flex items-center gap-x-1 font-bold" :class="`text-${activeColor}`" dir="ltr">
                        <BIcon v-loading="isLoading" :icon="percentageChange >= 0 ? 'PhTrendUp' : 'PhTrendDown'" class="w-4 h-4" />
                        <span v-loading="isLoading" class="text-label-sm select-none">{{ Math.abs(percentageChange) }}%</span>
                    </span>
                </div>
            </div>

            <div v-loading="isLoading" class="w-32 h-16 relative mask-reveal" :class="{ 'mask-active': isChartReady }">
                <canvas ref="canvasRef"></canvas>
            </div>
        </div>

        <div class="w-full px-4 mt-1">
            <div  class="flex gap-x-2 w-full h-2">
                <div v-loading="isLoading" v-for="i in 5" :key="i" class="flex-1 rounded-full transition-all duration-500"
                    :class="[i <= scoreLevel ? '' : 'bg-surface-variant-3']"
                    :style="i <= scoreLevel ? { background: activeGradient } : {}"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw, nextTick } from 'vue';
import { useI18n } from '#imports';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler);

const props = defineProps<{
    type: 'mental' | 'physical' | 'social' | 'all'
}>();

const isLoading = ref(false)
const { t } = useI18n();

// --- Data & State ---
const chartData = [10, 20, 30, 20, 10, 5, 20];
const isChartReady = ref(false); // Controls the CSS animation trigger
let chartInstance: Chart | null = null;
const max = ref(30)
const min = ref(10)

const healthState = computed(() => {
    const level = scoreLevel.value;
    if (level <= 1) return 'bad';
    if (level <= 3) return 'medium';
    if (level <= 4) return 'good';
    return 'great';
});

const scoreLevel = computed(() => {
    const range = max.value - min.value;
    const step = range / 5;
    return Math.ceil((chartData[chartData.length - 1] - min.value) / step);
});

const percentageChange = computed(() => {
    if (chartData.length < 2) return 0;
    const start = chartData[0];
    const end = chartData[chartData.length - 1];
    return start === 0 ? 0 : Math.round(((end - start) / start) * 100);
});

const activeColor = computed(() => {
    const map = { bad: 'error', medium: 'warning', good: 'primary', great: 'secondary' };
    return map[healthState.value];
});

const activeGradient = computed(() => {
    // Map health states to the diamond gradients in themes.css
    const map = {
        bad: 'var(--background-image-diamond-error)',
        medium: 'var(--background-image-diamond-warning)',
        good: 'var(--background-image-diamond-primary)',
        great: 'var(--background-image-diamond-primary-secondary)'
    };
    return map[healthState.value];
});

// --- Chart Initialization ---
const canvasRef = ref<HTMLCanvasElement | null>(null);


onMounted(() => {
    renderChart()
});

const renderChart = () => {
    if (!canvasRef.value) return;

    const ctx = canvasRef.value.getContext('2d')!;

    // 1. Resolve the theme color based on the computed activeColor ('error' | 'warning' | 'primary' | 'secondary')
    const style = getComputedStyle(document.documentElement);

    // Fetch the 500 shade of the active color from your themes.css variables
    // Fallbacks provided for safety
    const colorMap: Record<string, string> = {
        error: style.getPropertyValue('--color-error-500').trim() || '#EF4444',
        warning: style.getPropertyValue('--color-warning-500').trim() || '#F59E0B',
        primary: style.getPropertyValue('--color-primary-500').trim() || '#2BB49A',
        secondary: style.getPropertyValue('--color-secondary-500').trim() || '#8B5CF6'
    };

    const mainColor = colorMap[activeColor.value] || colorMap.primary;

    // 2. Dynamic Gradient setup using the resolved mainColor
    // We convert the hex to RGBA for the gradient fill (25% opacity)
    const gradient = ctx.createLinearGradient(0, 0, 0, 64);
    gradient.addColorStop(0, hexToRgba(mainColor, 0.25));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    chartInstance = markRaw(new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map((_, i) => i.toString()),
            datasets: [{
                data: chartData,
                borderColor: mainColor,
                backgroundColor: gradient,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { display: false },
                y: { display: false, min: Math.min(...chartData) - 2, max: Math.max(...chartData) + 2 }
            }
        },
        plugins: [{
            id: 'lineShadow',
            beforeDatasetDraw(chart) {
                const { ctx } = chart;
                ctx.save();
                // Apply the shadow glow matching the state color (50% opacity)
                ctx.shadowColor = hexToRgba(mainColor, 0.5);
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 4;
            },
            afterDatasetDraw(chart) {
                chart.ctx.restore();
            }
        }]
    }));

    nextTick(() => {
        setTimeout(() => {
            isChartReady.value = true;
        }, 50);
    });
}

/**
 * Helper to handle hex to rgba conversion for canvas
 */
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy();
    }
});

const idk = () => console.log(`I don't really know!`);

// --- State Configurations ---
const socialCardStates = computed(() => [
    { key: 'support', label: t('dashboard.cards.states.social.fields.support'), icon: "PhHeart" },
    { key: 'interactions', label: t('dashboard.cards.states.social.fields.interactions'), icon: 'PhChatCenteredText' },
    { key: 'lifeMeaning', label: t('dashboard.cards.states.social.fields.lifeMeaning'), icon: 'PhCompass' },
    { key: 'calmness', label: t('dashboard.cards.states.social.fields.calmness'), icon: 'PhPersonSimpleTaiChi' }
]);

const mentalCardStates = computed(() => [
    { key: 'stress', label: t('dashboard.cards.states.mental.fields.stress'), icon: "PhSmileySad" },
    { key: 'focus', label: t('dashboard.cards.states.mental.fields.focus'), icon: 'PhCubeFocus' },
    { key: 'spiritualState', label: t('dashboard.cards.states.mental.fields.spiritualState'), icon: 'PhSmiley' },
    { key: 'sleeplessness', label: t('dashboard.cards.states.mental.fields.sleeplessness'), icon: 'PhBed' }
]);

const physicalCardStates = computed(() => [
    { key: 'bloodPressure', label: t('dashboard.cards.states.physical.fields.bloodPressure'), icon: "PhSmileySad" },
    { key: 'bloodOxygen', label: t('dashboard.cards.states.physical.fields.bloodOxygen'), icon: 'PhCubeFocus' },
    { key: 'bloodSugar', label: t('dashboard.cards.states.physical.fields.bloodSugar'), icon: 'PhSmiley' },
    { key: 'heartRate', label: t('dashboard.cards.states.physical.fields.heartRate'), icon: 'PhBed' }
]);

const cardFinalProps = computed(() => {
    switch (props.type) {
        case 'mental': return mentalCardStates.value;
        case 'physical': return physicalCardStates.value;
        case 'social': return socialCardStates.value;
        default: return [];
    }
});

const cardTitle = computed(() => {
    switch (props.type) {
        case 'all': return t('dashboard.cards.states.all');
        case 'mental': return t('dashboard.cards.states.mental.title');
        case 'physical': return t('dashboard.cards.states.physical.title');
        case 'social': return t('dashboard.cards.states.social.title');
    }
});
</script>

<style scoped>
/* GPU-Accelerated Mask Reveal */
.mask-reveal {
    /* Hardcoded to right so it always sweeps Left -> Right regardless of RTL/LTR */
    -webkit-mask-image: linear-gradient(to right, #000 40%, rgba(0, 0, 0, 0) 60%);
    mask-image: linear-gradient(to right, #000 40%, rgba(0, 0, 0, 0) 60%);

    -webkit-mask-size: 250% 100%;
    mask-size: 250% 100%;

    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;

    transition: -webkit-mask-position 1.2s cubic-bezier(0.4, 0, 0.2, 1),
        mask-position 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.mask-active {
    -webkit-mask-position: 0% 0;
    mask-position: 0% 0;
}

canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
}
</style>