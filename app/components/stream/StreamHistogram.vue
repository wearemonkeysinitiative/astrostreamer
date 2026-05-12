<script setup lang="ts">
import type { AppMode } from '~/composables/useMode'

const props = withDefaults(defineProps<{
  mode?: AppMode
}>(), {
  mode: 'manual'
})

const BARS = 48

function generateProfile(mode: AppMode): number[] {
  const peaks: Record<AppMode, number> = {
    astro: 0.18,
    manual: 0.48,
    chill: 0.55
  }
  const center = peaks[mode]
  return Array.from({ length: BARS }, (_, i) => {
    const t = i / (BARS - 1)
    const d = (t - center) / 0.25
    const base = Math.exp(-d * d / 2)
    // Add some noise for visual interest
    const noise = 0.1 * Math.sin(i * 3.7) + 0.05 * Math.cos(i * 7.3)
    return Math.max(0.02, Math.min(1, base + noise))
  })
}

const bars = computed(() => generateProfile(props.mode))

const svgHeight = 40
const barWidth = 100 / BARS
</script>

<template>
  <div
    class="absolute bottom-14 left-3 z-[5] rounded-lg px-2 py-1.5 backdrop-blur-sm"
    style="background: rgba(0,0,0,0.55)"
  >
    <svg :viewBox="`0 0 100 ${svgHeight}`" class="w-[120px] h-[40px]" preserveAspectRatio="none">
      <rect
        v-for="(h, i) in bars"
        :key="i"
        class="hist-bar"
        :x="i * barWidth"
        :y="svgHeight - h * svgHeight"
        :width="barWidth * 0.8"
        :height="h * svgHeight"
      />
    </svg>
  </div>
</template>
