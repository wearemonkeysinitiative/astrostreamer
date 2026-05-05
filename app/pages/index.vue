<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="p-4 lg:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">
      <VideoStream />

      <div class="flex flex-col gap-4">
        <WeatherWidget />
        <CameraPresets />
      </div>
    </div>
  </div>
</template>
