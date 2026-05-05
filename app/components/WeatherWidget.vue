<script setup lang="ts">
const { data: weather, status, error, refresh } = useWeather()

const weatherIconMap: Record<string, string> = {
  '01d': 'i-lucide-sun',
  '01n': 'i-lucide-moon',
  '02d': 'i-lucide-cloud-sun',
  '02n': 'i-lucide-cloud-moon',
  '03d': 'i-lucide-cloud',
  '03n': 'i-lucide-cloud',
  '04d': 'i-lucide-cloudy',
  '04n': 'i-lucide-cloudy',
  '09d': 'i-lucide-cloud-drizzle',
  '09n': 'i-lucide-cloud-drizzle',
  '10d': 'i-lucide-cloud-rain',
  '10n': 'i-lucide-cloud-rain',
  '11d': 'i-lucide-cloud-lightning',
  '11n': 'i-lucide-cloud-lightning',
  '13d': 'i-lucide-cloud-snow',
  '13n': 'i-lucide-cloud-snow',
  '50d': 'i-lucide-cloud-fog',
  '50n': 'i-lucide-cloud-fog'
}

function getWeatherIcon(iconCode: string): string {
  return weatherIconMap[iconCode] || 'i-lucide-cloud'
}
</script>

<template>
  <UCard title="Ярославль">
    <div v-if="status === 'pending'" class="flex flex-col gap-3">
      <USkeleton class="h-10 w-24" />
      <USkeleton class="h-4 w-32" />
      <div class="flex gap-4">
        <USkeleton class="h-4 w-16" />
        <USkeleton class="h-4 w-16" />
      </div>
    </div>

    <div v-else-if="weather" class="flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <UIcon :name="getWeatherIcon(weather.icon)" class="size-10 text-primary" />
        <div>
          <div class="text-3xl font-bold">{{ weather.temp }}°C</div>
          <div class="text-sm text-neutral-400 capitalize">{{ weather.description }}</div>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-thermometer" class="size-3.5" />
          Ощущается {{ weather.feelsLike }}°C
        </span>
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-wind" class="size-3.5" />
          {{ weather.wind }} м/с
        </span>
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-droplet" class="size-3.5" />
          {{ weather.humidity }}%
        </span>
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-cloud" class="size-3.5" />
          {{ weather.clouds }}%
        </span>
      </div>
    </div>

    <div v-else class="flex flex-col gap-2 text-sm text-neutral-500">
      <span>{{ error?.statusCode === 401 ? 'API-ключ не активирован (ждите до 2ч после создания)' : 'Не удалось загрузить погоду' }}</span>
      <UButton variant="soft" size="xs" icon="i-lucide-refresh-cw" label="Повторить" @click="refresh()" />
    </div>
  </UCard>
</template>
