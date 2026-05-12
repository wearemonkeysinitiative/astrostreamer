<script setup lang="ts">
import type { AppMode } from '~/composables/useMode'
import { ISO_SCALE, SHUTTER_MAN, SHUTTER_AST, WB_PRESETS } from '~/composables/useCameraState'

const props = defineProps<{
  mode: AppMode
}>()

const { state, setCamPatch } = useCameraState()

const shutterOptions = computed(() =>
  props.mode === 'astro' ? [...SHUTTER_AST] : [...SHUTTER_MAN]
)

const { capture } = useCamera()

const capturing = ref(false)
const detectActive = ref(false)

async function onCapture() {
  capturing.value = true
  try {
    await capture()
  } catch (err) {
    console.error('Capture failed:', err)
  } finally {
    setTimeout(() => { capturing.value = false }, 600)
  }
}
</script>

<template>
  <div
    class="border-t px-4 py-3"
    :style="{ background: 'var(--bg-1)', borderColor: 'var(--line)' }"
  >
    <div class="grid grid-cols-12 gap-4 items-start">
      <!-- Title col (2) -->
      <div class="col-span-2 flex flex-col gap-1">
        <span class="font-mono text-[11px] font-semibold uppercase tracking-wider" style="color: var(--ink-1)">
          Camera
        </span>
        <span class="font-mono text-[9px]" style="color: var(--ink-3)">
          Canon EOS 600D
        </span>
        <span class="font-mono text-[9px]" style="color: var(--ink-3)">
          Гелиос 44МС 58mm
        </span>
      </div>

      <!-- Controls col (7) -->
      <div class="col-span-7 flex items-start gap-5">
        <!-- ISO Stepper -->
        <ControlsValueStepper
          label="ISO"
          :model-value="state.iso"
          :options="[...ISO_SCALE]"
          @update:model-value="setCamPatch({ iso: $event })"
        />

        <!-- Shutter Stepper -->
        <ControlsValueStepper
          label="Shutter"
          :model-value="state.shutter"
          :options="shutterOptions"
          @update:model-value="setCamPatch({ shutter: $event })"
        />

        <!-- Aperture (read-only) -->
        <div class="flex flex-col gap-1.5">
          <span class="font-mono text-[10px] uppercase tracking-wider" style="color: var(--ink-3)">
            Aperture
          </span>
          <span class="font-mono text-sm font-semibold" style="color: var(--ink-2)">
            ƒ/{{ state.aperture }}
          </span>
          <span class="font-mono text-[9px]" style="color: var(--ink-3)">fixed lens</span>
        </div>

        <!-- Focus slider -->
        <div class="flex flex-col gap-1.5 min-w-[100px]">
          <span class="font-mono text-[10px] uppercase tracking-wider" style="color: var(--ink-3)">
            Focus
          </span>
          <input
            type="range"
            class="rng"
            min="0"
            max="100"
            :value="state.focus"
            @input="setCamPatch({ focus: Number(($event.target as HTMLInputElement).value) })"
          >
          <div class="flex justify-between font-mono text-[8px]" style="color: var(--ink-3)">
            <span>0.5m</span>
            <span>{{ state.focus }}</span>
            <span>∞</span>
          </div>
        </div>

        <!-- White Balance chips -->
        <div class="flex flex-col gap-1.5">
          <span class="font-mono text-[10px] uppercase tracking-wider" style="color: var(--ink-3)">
            White Balance
          </span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="wb in WB_PRESETS"
              :key="wb"
              class="font-mono text-[10px] px-2 py-1 rounded transition-colors"
              :style="{
                background: state.wb === wb ? 'var(--bg-3)' : 'transparent',
                color: state.wb === wb ? 'var(--accent-2)' : 'var(--ink-3)',
                border: state.wb === wb ? '1px solid var(--accent-2)' : '1px solid var(--line)'
              }"
              @click="setCamPatch({ wb })"
            >
              {{ wb }}
            </button>
          </div>
        </div>
      </div>

      <!-- Actions col (3) -->
      <div class="col-span-3 flex flex-col items-end gap-2">
        <!-- Capture button -->
        <button
          class="flex items-center gap-2 font-mono text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors"
          :style="{
            background: 'var(--accent)',
            color: 'var(--bg-0)'
          }"
          @click="onCapture"
        >
          ◉ Capture
        </button>

        <!-- Detect Stars (astro only) -->
        <button
          v-if="mode === 'astro'"
          class="flex items-center gap-2 font-mono text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors"
          :style="{
            background: detectActive ? 'color-mix(in srgb, var(--accent-3) 15%, transparent)' : 'transparent',
            color: 'var(--accent-3)',
            border: '1px solid var(--accent-3)'
          }"
          @click="detectActive = !detectActive"
        >
          ✦ Detect Stars
        </button>
      </div>
    </div>
  </div>
</template>
