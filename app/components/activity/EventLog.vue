<script setup lang="ts">
const { filteredEvents, filters, clearEvents, sseConnected } = useEvents()

const telemetry = ref<{ cpuTemp: number; cpuLoad: number } | null>(null)

let telemetryTimer: ReturnType<typeof setInterval> | undefined

async function fetchTelemetry() {
  try {
    telemetry.value = await $fetch('/api/telemetry')
  } catch {
    telemetry.value = null
  }
}

onMounted(() => {
  fetchTelemetry()
  telemetryTimer = setInterval(fetchTelemetry, 10_000)
})

onUnmounted(() => {
  if (telemetryTimer) clearInterval(telemetryTimer)
})
</script>

<template>
  <aside
    class="flex flex-col h-full border-l"
    :style="{ background: 'var(--bg-1)', borderColor: 'var(--line)' }"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-3 py-2.5 border-b"
      :style="{ borderColor: 'var(--line)' }"
    >
      <div class="flex items-center gap-2">
        <span class="font-mono text-[12px] font-semibold" style="color: var(--ink-1)">Activity</span>
        <span
          class="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
          :style="{ background: 'var(--bg-3)', color: 'var(--ink-3)' }"
        >
          {{ filteredEvents.length }}
        </span>
      </div>
      <button
        class="font-mono text-[10px] px-2 py-1 rounded transition-colors"
        :style="{ color: 'var(--ink-3)', background: 'transparent' }"
        @click="clearEvents()"
      >
        Clear
      </button>
    </div>

    <!-- Filters -->
    <ActivityEventFilters v-model="filters" />

    <!-- Event list -->
    <div class="flex-1 log-scroll">
      <ActivityEventItem
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
      />

      <div
        v-if="filteredEvents.length === 0"
        class="flex items-center justify-center py-8 font-mono text-[11px]"
        style="color: var(--ink-3)"
      >
        No events
      </div>
    </div>

    <!-- Footer -->
    <div
      class="flex items-center justify-between px-3 py-2 border-t"
      :style="{ borderColor: 'var(--line)' }"
    >
      <div class="flex items-center gap-2 font-mono text-[10px]">
        <span
          class="size-1.5 rounded-full"
          :style="{ background: sseConnected ? 'var(--good)' : 'var(--bad)' }"
        />
        <span style="color: var(--ink-3)">
          {{ sseConnected ? 'SSE connected' : 'disconnected' }}
        </span>
      </div>
      <span class="font-mono text-[10px]" style="color: var(--ink-3)">
        <template v-if="telemetry">
          CPU {{ telemetry.cpuTemp > 0 ? `${telemetry.cpuTemp}°C · ${telemetry.cpuLoad}%` : `${telemetry.cpuLoad}%` }}
        </template>
        <template v-else>
          CPU —
        </template>
      </span>
    </div>
  </aside>
</template>
