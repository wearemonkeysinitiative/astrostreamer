<script setup lang="ts">
import { EVENT_KIND_META, type EventKind } from '~/composables/useEvents'

const props = defineProps<{
  modelValue: Record<EventKind, boolean>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<EventKind, boolean>]
}>()

const kinds = Object.keys(EVENT_KIND_META) as EventKind[]

function toggle(kind: EventKind) {
  emit('update:modelValue', {
    ...props.modelValue,
    [kind]: !props.modelValue[kind]
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-1 px-3 py-2">
    <button
      v-for="kind in kinds"
      :key="kind"
      class="font-mono text-[9px] font-semibold px-2 py-1 rounded transition-colors"
      :style="{
        color: modelValue[kind] ? EVENT_KIND_META[kind].color : 'var(--ink-3)',
        background: modelValue[kind] ? EVENT_KIND_META[kind].color + '15' : 'transparent',
        border: modelValue[kind]
          ? '1px solid ' + EVENT_KIND_META[kind].color + '30'
          : '1px solid var(--line)',
        opacity: modelValue[kind] ? 1 : 0.5
      }"
      @click="toggle(kind)"
    >
      {{ EVENT_KIND_META[kind].tag }}
    </button>
  </div>
</template>
