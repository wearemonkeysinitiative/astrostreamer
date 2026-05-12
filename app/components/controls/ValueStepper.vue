<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string
  options: readonly string[]
  hint?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentIndex = computed(() => props.options.indexOf(props.modelValue))
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < props.options.length - 1)

function stepBy(dir: -1 | 1) {
  const next = currentIndex.value + dir
  if (next >= 0 && next < props.options.length) {
    emit('update:modelValue', props.options[next])
  }
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label -->
    <span class="font-mono text-[10px] uppercase tracking-wider" style="color: var(--ink-3)">
      {{ label }}
    </span>

    <!-- Stepper controls -->
    <div class="flex items-center gap-2">
      <button
        class="size-7 flex items-center justify-center rounded font-mono text-sm transition-colors"
        :style="{
          background: 'var(--bg-3)',
          color: canPrev ? 'var(--ink-0)' : 'var(--ink-3)',
          border: '1px solid var(--line)'
        }"
        :disabled="!canPrev"
        @click="stepBy(-1)"
      >
        −
      </button>

      <span
        class="font-mono text-sm font-semibold min-w-[60px] text-center"
        style="color: var(--ink-0)"
      >
        {{ modelValue }}
      </span>

      <button
        class="size-7 flex items-center justify-center rounded font-mono text-sm transition-colors"
        :style="{
          background: 'var(--bg-3)',
          color: canNext ? 'var(--ink-0)' : 'var(--ink-3)',
          border: '1px solid var(--line)'
        }"
        :disabled="!canNext"
        @click="stepBy(1)"
      >
        +
      </button>
    </div>

    <!-- Scale dots -->
    <div class="flex items-center gap-0.5">
      <span
        v-for="(opt, i) in options"
        :key="opt"
        class="rounded-full transition-all"
        :style="{
          width: i === currentIndex ? '8px' : '4px',
          height: '4px',
          background: i === currentIndex ? 'var(--accent)' : 'var(--bg-3)'
        }"
      />
    </div>

    <!-- Hint -->
    <span v-if="hint" class="font-mono text-[9px]" style="color: var(--ink-3)">
      {{ hint }}
    </span>
  </div>
</template>
