<script setup lang="ts">
const { mode } = useMode()

const cameraStatus = ref<{ connected: boolean; model?: string } | null>(null)

async function fetchStatus() {
  try {
    cameraStatus.value = await $fetch('/api/camera/status')
  } catch {
    cameraStatus.value = { connected: false }
  }
}

onMounted(() => {
  fetchStatus()
})

const isConnected = computed(() => cameraStatus.value?.connected ?? false)
const cameraModel = computed(() => cameraStatus.value?.model || 'Camera')
</script>

<template>
  <header
    class="flex items-center justify-between px-5 h-14 border-b"
    :style="{ background: 'var(--bg-1)', borderColor: 'var(--line)' }"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-[var(--accent)]">
        <path
          d="M12 2l1.09 3.37L16.46 4l-1.37 3.09L18.46 8.46l-3.37 1.09L16 12l-3.37-1.09L11.54 14l-1.09-3.37L7.09 11.54l1.37-3.09L5.09 7.09l3.37-1.09L8 3l3.37 1.09z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6" />
      </svg>
      <span class="font-display text-xl not-italic" style="color: var(--ink-0)">Star Watcher</span>
      <span
        class="font-mono text-[10px] px-2 py-0.5 rounded-full"
        :style="{ background: 'var(--bg-3)', color: 'var(--ink-3)' }"
      >
        v0.4 · orange pi
      </span>
    </div>

    <!-- Mode Switcher (center) -->
    <ModeSwitcher :model-value="mode" @update:model-value="useMode().setMode($event)" />

    <!-- Status (right) -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 font-mono text-xs" style="color: var(--ink-2)">
        <span
          class="size-2 rounded-full"
          :style="{ background: isConnected ? 'var(--good)' : 'var(--bad)' }"
        />
        <span>{{ cameraModel }}</span>
        <span v-if="isConnected" style="color: var(--ink-3)">· online</span>
        <span v-else style="color: var(--bad)">· offline</span>
      </div>
      <button
        class="p-1.5 rounded"
        :style="{ color: 'var(--ink-2)', background: 'transparent' }"
      >
        <UIcon name="i-lucide-settings" class="size-4" />
      </button>
    </div>
  </header>
</template>
