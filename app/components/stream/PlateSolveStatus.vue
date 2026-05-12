<script setup lang="ts">
defineProps<{
  active?: boolean
  starsCount?: number
  constellationsCount?: number
}>()
</script>

<template>
  <div
    class="absolute bottom-14 right-3 z-[5] rounded-lg px-3 py-2 backdrop-blur-sm font-mono text-[11px]"
    :style="{
      background: 'rgba(0,0,0,0.55)',
      border: active ? '1px solid color-mix(in srgb, var(--accent-3) 40%, transparent)' : '1px solid transparent'
    }"
  >
    <div class="flex items-center gap-2">
      <span
        class="size-1.5 rounded-full"
        :style="{ background: active ? 'var(--accent-3)' : 'var(--ink-3)' }"
      />
      <span v-if="active" style="color: var(--accent-3)">
        {{ starsCount }} stars · {{ constellationsCount }} constellations
      </span>
      <span v-else style="color: var(--ink-3)">
        press Detect Stars to identify
      </span>
    </div>
  </div>
</template>
