<script setup lang="ts">
defineProps<{
  iso: string
  shutter: string
  aperture: string
  wb: string
}>()

const fields = computed(() => [
  { label: 'ISO', key: 'iso' },
  { label: 'SH', key: 'shutter' },
  { label: 'AP', key: 'aperture' },
  { label: 'WB', key: 'wb' }
])
</script>

<template>
  <div
    class="absolute bottom-3 left-3 z-[5] rounded-lg px-3 py-2 backdrop-blur-sm"
    style="background: rgba(0,0,0,0.55)"
  >
    <div class="grid grid-cols-4 gap-x-4 gap-y-1 font-mono text-[11px]">
      <template v-for="f in fields" :key="f.key">
        <div style="color: var(--ink-3)">{{ f.label }}</div>
      </template>
      <div style="color: var(--accent)">{{ iso }}</div>
      <div style="color: var(--ink-0)">{{ shutter }}</div>
      <div style="color: var(--ink-2)">ƒ/{{ aperture }}</div>
      <div style="color: var(--accent-2)">{{ wb }}</div>
    </div>
  </div>
</template>
