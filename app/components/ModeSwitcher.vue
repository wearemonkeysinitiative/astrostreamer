<script setup lang="ts">
import type { AppMode } from '~/composables/useMode'

defineProps<{
  modelValue: AppMode
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AppMode]
}>()

const modes: { value: AppMode; label: string; hint: string; color: string }[] = [
  { value: 'chill',  label: 'CHILL',          hint: 'video only',                color: 'var(--good)' },
  { value: 'manual', label: 'MANUAL',         hint: 'ISO \u00b7 shutter \u00b7 focus', color: 'var(--accent)' },
  { value: 'astro',  label: 'ASTROLANDSCAPE', hint: 'long exposure + star id',   color: 'var(--accent-3)' }
]
</script>

<template>
  <div class="flex items-center gap-1 rounded-lg p-1" :style="{ background: 'var(--bg-2)' }">
    <button
      v-for="m in modes"
      :key="m.value"
      class="relative flex flex-col items-center px-4 py-1.5 rounded-md transition-colors"
      :style="{
        background: modelValue === m.value ? 'var(--bg-3)' : 'transparent',
        color: modelValue === m.value ? 'var(--ink-0)' : 'var(--ink-3)'
      }"
      @click="emit('update:modelValue', m.value)"
    >
      <span class="font-mono text-[11px] font-semibold tracking-wider">{{ m.label }}</span>
      <span class="font-mono text-[9px]" style="color: var(--ink-3)">{{ m.hint }}</span>
      <!-- Active underline -->
      <span
        v-if="modelValue === m.value"
        class="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
        :style="{ background: m.color }"
      />
    </button>
  </div>
</template>
