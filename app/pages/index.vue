<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { mode } = useMode()
</script>

<template>
  <div class="p-4 lg:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">
      <VideoStream />

      <div class="flex flex-col gap-4">
        <template v-if="mode === 'chill'">
          <WeatherWidget />
          <CameraPresets mode="chill" />
        </template>

        <template v-else>
          <CameraControlPanel />
          <CameraPresets mode="astro" />
        </template>
      </div>
    </div>
  </div>
</template>
