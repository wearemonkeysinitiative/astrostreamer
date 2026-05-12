<script setup lang="ts">
import { EVENT_KIND_META, type EventEntry } from '~/composables/useEvents'

defineProps<{
  event: EventEntry
}>()
</script>

<template>
  <div
    class="flex items-start gap-2.5 px-3 py-2 border-b fade-in"
    :style="{ borderColor: 'var(--line)' }"
  >
    <!-- Timestamp -->
    <span class="font-mono text-[10px] shrink-0 pt-0.5" style="color: var(--ink-3)">
      {{ event.time }}
    </span>

    <!-- Tag badge -->
    <span
      class="font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0"
      :style="{
        color: EVENT_KIND_META[event.kind].color,
        background: EVENT_KIND_META[event.kind].color + '18',
        border: '1px solid ' + EVENT_KIND_META[event.kind].color + '30'
      }"
    >
      {{ EVENT_KIND_META[event.kind].tag }}
    </span>

    <!-- Message + detail -->
    <div class="flex flex-col gap-0.5 min-w-0">
      <span class="font-mono text-[11px]" style="color: var(--ink-1)">
        {{ event.message }}
      </span>
      <span v-if="event.detail" class="font-mono text-[10px]" style="color: var(--ink-3)">
        {{ event.detail }}
      </span>
    </div>
  </div>
</template>
