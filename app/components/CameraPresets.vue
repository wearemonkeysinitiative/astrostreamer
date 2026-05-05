<script setup lang="ts">
const { setConfig } = useCamera()

interface Preset {
  name: string
  icon: string
  params: Record<string, string>
}

const presets: Preset[] = [
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
