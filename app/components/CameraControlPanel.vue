<script setup lang="ts">
const { setConfig } = useCamera()

const applying = ref<string | null>(null)

const iso = ref<string>()
const shutterspeed = ref<string>()
const whitebalance = ref<string>()
const exposureMode = ref<string>()

const isoOptions = ['100', '200', '400', '800', '1600', '3200', '6400', '12800']

const shutterspeedOptions = [
  '1/4000', '1/3200', '1/2500', '1/2000', '1/1600', '1/1250', '1/1000',
  '1/800', '1/640', '1/500', '1/400', '1/320', '1/250', '1/200', '1/160',
  '1/125', '1/100', '1/80', '1/60', '1/50', '1/40', '1/30', '1/25',
  '1/20', '1/15', '1/13', '1/10', '1/8', '1/6', '1/5', '1/4',
  '0.3', '0.5', '0.8', '1', '1.3', '1.6', '2', '2.5', '3.2',
  '4', '5', '6', '8', '10', '13', '15', '20', '25', '30', 'bulb'
]

const whitebalanceOptions = [
  { label: 'Авто', value: 'Auto' },
  { label: 'Дневной свет', value: 'Daylight' },
  { label: 'Тень', value: 'Shade' },
  { label: 'Облачно', value: 'Cloudy' },
  { label: 'Лампа накаливания', value: 'Tungsten' },
  { label: 'Флуоресцент', value: 'Fluorescent' },
  { label: 'Вспышка', value: 'Flash' }
]

const exposureModeOptions = [
  { label: 'Ручной (M)', value: 'Manual' },
  { label: 'Программный (P)', value: 'P' },
  { label: 'Приоритет выдержки (Tv)', value: 'TV' },
  { label: 'Приоритет диафрагмы (Av)', value: 'AV' }
]

async function applyParam(key: string, value: string | undefined) {
  if (!value) return
  applying.value = key
  try {
    await setConfig(key, value)
  } finally {
    applying.value = null
  }
}
</script>

<template>
  <UCard title="Камера">
    <div class="flex flex-col gap-4">
      <div>
        <label class="text-xs text-neutral-400 mb-1 block">Режим экспозиции</label>
        <USelect
          v-model="exposureMode"
          :items="exposureModeOptions"
          placeholder="Режим"
          icon="i-lucide-settings"
          :loading="applying === 'autoexposuremode'"
          @update:model-value="applyParam('autoexposuremode', $event)"
        />
      </div>

      <div>
        <label class="text-xs text-neutral-400 mb-1 block">ISO</label>
        <USelect
          v-model="iso"
          :items="isoOptions"
          placeholder="ISO"
          icon="i-lucide-gauge"
          :loading="applying === 'iso'"
          @update:model-value="applyParam('iso', $event)"
        />
      </div>

      <div>
        <label class="text-xs text-neutral-400 mb-1 block">Выдержка</label>
        <USelect
          v-model="shutterspeed"
          :items="shutterspeedOptions"
          placeholder="Выдержка"
          icon="i-lucide-timer"
          :loading="applying === 'shutterspeed'"
          @update:model-value="applyParam('shutterspeed', $event)"
        />
      </div>

      <div>
        <label class="text-xs text-neutral-400 mb-1 block">Баланс белого</label>
        <USelect
          v-model="whitebalance"
          :items="whitebalanceOptions"
          placeholder="WB"
          icon="i-lucide-palette"
          :loading="applying === 'whitebalance'"
          @update:model-value="applyParam('whitebalance', $event)"
        />
      </div>

      <div class="text-xs text-neutral-500 flex items-center gap-1">
        <UIcon name="i-lucide-aperture" class="size-3.5" />
        Объектив: Гелиос 44МС — f/2.0 (фикс)
      </div>
    </div>
  </UCard>
</template>
