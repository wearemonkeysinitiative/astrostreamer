<script setup lang="ts">
const props = withDefaults(defineProps<{
  mode?: 'chill' | 'astro'
}>(), {
  mode: 'chill'
})

const { setConfig } = useCamera()

interface Preset {
  name: string
  icon: string
  params: Record<string, string>
}

const chillPresets: Preset[] = [
  {
    name: 'Дневной',
    icon: 'i-lucide-sun',
    params: { iso: '200', shutterspeed: '1/500', whitebalance: 'Auto' }
  },
  {
    name: 'Облачный',
    icon: 'i-lucide-cloud',
    params: { iso: '400', shutterspeed: '1/250', whitebalance: 'Cloudy' }
  },
  {
    name: 'Вечерний',
    icon: 'i-lucide-sunset',
    params: { iso: '800', shutterspeed: '1/60', whitebalance: 'Shade' }
  }
]

const astroPresets: Preset[] = [
  {
    name: 'Млечный путь',
    icon: 'i-lucide-sparkles',
    params: { autoexposuremode: 'Manual', iso: '1600', shutterspeed: '20', whitebalance: 'Daylight' }
  },
  {
    name: 'Луна',
    icon: 'i-lucide-moon',
    params: { autoexposuremode: 'Manual', iso: '100', shutterspeed: '1/125', whitebalance: 'Tungsten' }
  },
  {
    name: 'Звёздные треки',
    icon: 'i-lucide-orbit',
    params: { autoexposuremode: 'Manual', iso: '200', shutterspeed: '30', whitebalance: 'Daylight' }
  },
  {
    name: 'Ночной пейзаж',
    icon: 'i-lucide-mountain',
    params: { autoexposuremode: 'Manual', iso: '1600', shutterspeed: '15', whitebalance: 'Daylight' }
  }
]

const presets = computed(() => props.mode === 'astro' ? astroPresets : chillPresets)

const applying = ref<string | null>(null)

async function applyPreset(preset: Preset) {
  applying.value = preset.name
  try {
    for (const [key, value] of Object.entries(preset.params)) {
      await setConfig(key, value)
    }
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
