<script setup lang="ts">
import type { AppMode } from '~/composables/useMode'

defineProps<{
  mode: AppMode
  capturing?: boolean
}>()

const { cameraInfo } = useCameraState()

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
})

onBeforeUnmount(() => clearInterval(timer))

const utcTime = computed(() => {
  const d = now.value
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
})

const modeColors: Record<AppMode, string> = {
  chill: 'var(--good)',
  manual: 'var(--accent)',
  astro: 'var(--accent-3)'
}
</script>

<template>
  <div class="absolute inset-0 z-[5] pointer-events-none">
    <!-- Top-left: REC + RTSP info -->
    <div class="absolute top-2 left-2 lg:top-3 lg:left-3 flex items-center gap-2 lg:gap-3 font-mono text-[10px] lg:text-[11px]">
      <div class="flex items-center gap-1.5" style="color: var(--bad)">
        <span class="size-2 rounded-full rec-dot" style="background: var(--bad)" />
        <span>REC</span>
      </div>
      <span style="color: var(--ink-3)">·</span>
      <span class="hidden lg:inline" style="color: var(--ink-2)">RTSP {{ cameraInfo.resolution }} · {{ cameraInfo.fps }} fps</span>
      <span class="hidden lg:inline" style="color: var(--ink-3)">|</span>
      <span style="color: var(--ink-2)">{{ utcTime }} UTC</span>
    </div>

    <!-- Top-right: Camera + Mode badge -->
    <div class="absolute top-2 right-2 lg:top-3 lg:right-3 flex items-center gap-2 lg:gap-3 font-mono text-[10px] lg:text-[11px]">
      <span style="color: var(--ink-2)">CAM · {{ cameraInfo.model }}</span>
      <span
        class="px-2 py-0.5 rounded text-[9px] lg:text-[10px] font-semibold uppercase"
        :style="{
          background: modeColors[mode] + '18',
          color: modeColors[mode],
          border: '1px solid ' + modeColors[mode] + '40'
        }"
      >
        {{ mode }}
      </span>
    </div>

    <!-- Capture flash -->
    <div
      v-if="capturing"
      class="absolute inset-0 bg-white capture-flash pointer-events-none"
    />
  </div>
</template>
