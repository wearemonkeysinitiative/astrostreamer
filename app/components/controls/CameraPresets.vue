<script setup lang="ts">
import type { AppMode } from '~/composables/useMode'

const props = withDefaults(defineProps<{
  mode?: AppMode
}>(), {
  mode: 'chill'
})

const { setCamPatch } = useCameraState()

interface Preset {
  name: string
  icon: string
  params: { iso: string; shutter: string; wb: string }
}

const chillPresets: Preset[] = [
  {
    name: 'Дневной',
    icon: 'i-lucide-sun',
    params: { iso: '200', shutter: '1/500', wb: 'AUTO' }
  },
  {
    name: 'Облачный',
    icon: 'i-lucide-cloud',
    params: { iso: '400', shutter: '1/250', wb: 'CLOUDY' }
  },
  {
    name: 'Вечерний',
    icon: 'i-lucide-sunset',
    params: { iso: '800', shutter: '1/60', wb: 'SHADE' }
  }
]

const astroPresets: Preset[] = [
  {
    name: 'Млечный путь',
    icon: 'i-lucide-sparkles',
    params: { iso: '1600', shutter: '20', wb: 'DAYLIGHT' }
  },
  {
    name: 'Луна',
    icon: 'i-lucide-moon',
    params: { iso: '100', shutter: '1/125', wb: 'TUNGSTEN' }
  },
  {
    name: 'Звёздные треки',
    icon: 'i-lucide-orbit',
    params: { iso: '200', shutter: '30', wb: 'DAYLIGHT' }
  },
  {
    name: 'Ночной пейзаж',
    icon: 'i-lucide-mountain',
    params: { iso: '1600', shutter: '15', wb: 'DAYLIGHT' }
  }
]

const presets = computed(() => props.mode === 'astro' ? astroPresets : chillPresets)

const applying = ref<string | null>(null)

async function applyPreset(preset: Preset) {
  applying.value = preset.name
  try {
    await setCamPatch(preset.params)
  } finally {
    applying.value = null
  }
}
</script>

<template>
  <UCard title="Пресеты">
    <div class="flex flex-col gap-2">
      <UButton
        v-for="preset in presets"
        :key="preset.name"
        :icon="preset.icon"
        :label="preset.name"
        :loading="applying === preset.name"
        variant="soft"
        block
        @click="applyPreset(preset)"
      />
    </div>
  </UCard>
</template>
