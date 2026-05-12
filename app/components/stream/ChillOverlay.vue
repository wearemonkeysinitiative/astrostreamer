<script setup lang="ts">
const emit = defineEmits<{
  exit: []
}>()
</script>

<template>
  <div class="absolute inset-0 z-[5] pointer-events-none">
    <!-- LIVE badge (top-left) -->
    <div class="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-auto">
      <span class="size-2 rounded-full rec-dot" style="background: var(--bad)" />
      <span class="font-mono text-[11px] font-semibold" style="color: var(--bad)">LIVE</span>
    </div>

    <!-- Motto (bottom center) -->
    <div class="absolute bottom-8 inset-x-0 text-center">
      <p class="font-display text-xl lg:text-2xl" style="color: var(--ink-2)">
        you are watching the sky
      </p>
    </div>

    <!-- Exit chill button (bottom-right) -->
    <button
      class="absolute bottom-4 right-4 flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 rounded-md pointer-events-auto transition-colors"
      :style="{
        color: 'var(--ink-2)',
        background: 'var(--bg-2)',
        border: '1px solid var(--line)'
      }"
      @click="emit('exit')"
    >
      ⤴ exit chill
    </button>
  </div>
</template>
