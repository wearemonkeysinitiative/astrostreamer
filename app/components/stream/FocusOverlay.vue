<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <div
    class="absolute bottom-3 right-3 z-[5] rounded-lg px-3 py-2 backdrop-blur-sm w-[140px]"
    style="background: rgba(0,0,0,0.55)"
  >
    <div class="flex items-center justify-between mb-1.5 font-mono text-[10px]">
      <span style="color: var(--ink-3)">Focus</span>
      <span style="color: var(--ink-1)">{{ value }}/100</span>
    </div>
    <div class="h-1.5 rounded-full overflow-hidden" style="background: var(--bg-3)">
      <div
        class="h-full rounded-full transition-all duration-300"
        :style="{
          width: value + '%',
          background: 'var(--accent)'
        }"
      />
    </div>
    <div class="flex justify-between mt-1 font-mono text-[8px]" style="color: var(--ink-3)">
      <span>0.5m</span>
      <span>∞</span>
    </div>
  </div>
</template>
