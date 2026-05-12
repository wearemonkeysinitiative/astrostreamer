<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { mode, setMode } = useMode()
const { state, initFromServer } = useCameraState()
const { connectSSE, disconnectSSE } = useEvents()

const capturing = ref(false)
const detectActive = ref(false)
const eventLogOpen = ref(false)

onMounted(() => {
  connectSSE()
  initFromServer()
})

onUnmounted(() => {
  disconnectSSE()
})
</script>

<template>
  <div class="flex-1 flex flex-col">
    <!-- Main content area -->
    <div
      class="flex-1 flex flex-col lg:grid"
      :class="mode !== 'chill' && 'lg:grid-cols-[minmax(0,1fr)_360px]'"
    >
      <!-- Left: Video + overlays -->
      <div class="flex flex-col">
        <!-- Video container -->
        <div class="flex-1 relative">
          <StreamVideoStream :mode="mode" class="h-full">
            <!-- Chill overlay -->
            <StreamChillOverlay
              v-if="mode === 'chill'"
              @exit="setMode('manual')"
            />

            <!-- HUD overlay (manual/astro) -->
            <StreamHUD
              v-if="mode !== 'chill'"
              :mode="mode"
              :capturing="capturing"
            />

            <!-- Exposure overlay (manual/astro) -->
            <StreamExposureOverlay
              v-if="mode !== 'chill'"
              :iso="state.iso"
              :shutter="state.shutter"
              :aperture="state.aperture"
              :wb="state.wb"
            />

            <!-- Histogram (manual/astro) -->
            <StreamHistogram
              v-if="mode !== 'chill'"
              :mode="mode"
            />

            <!-- Focus overlay (manual/astro) -->
            <StreamFocusOverlay
              v-if="mode !== 'chill'"
              :value="state.focus"
            />

            <!-- Plate solve status (astro only) -->
            <StreamPlateSolveStatus
              v-if="mode === 'astro'"
              :active="detectActive"
              :stars-count="47"
              :constellations-count="3"
            />

            <!-- Star overlay (astro only) -->
            <StreamStarOverlay
              v-if="mode === 'astro'"
              :visible="detectActive"
              overlay-style="lines"
            />
          </StreamVideoStream>
        </div>

        <!-- Camera controls strip (manual/astro) -->
        <ControlsCameraControls
          v-if="mode !== 'chill'"
          :mode="mode"
        />
      </div>

      <!-- Right: Event Log — desktop (>= lg) -->
      <ActivityEventLog v-if="mode !== 'chill'" class="hidden lg:flex" />
    </div>

    <!-- Mobile Event Log toggle button (< lg) -->
    <button
      v-if="mode !== 'chill'"
      class="fixed bottom-4 right-4 z-40 lg:hidden flex items-center gap-2 font-mono text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg"
      :style="{ background: 'var(--bg-3)', color: 'var(--ink-1)', border: '1px solid var(--line)' }"
      @click="eventLogOpen = true"
    >
      <UIcon name="i-lucide-activity" class="size-4" />
      Activity
    </button>

    <!-- Mobile Event Log overlay (< lg) -->
    <Teleport to="body">
      <Transition name="slide-log">
        <div
          v-if="eventLogOpen && mode !== 'chill'"
          class="fixed inset-0 z-50 lg:hidden"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50" @click="eventLogOpen = false" />
          <!-- Panel -->
          <aside
            class="absolute top-0 right-0 bottom-0 w-[320px] max-w-[85vw] flex flex-col"
            :style="{ background: 'var(--bg-1)', borderLeft: '1px solid var(--line)' }"
          >
            <div class="flex items-center justify-between px-3 py-2.5 border-b" :style="{ borderColor: 'var(--line)' }">
              <span class="font-mono text-[12px] font-semibold" style="color: var(--ink-1)">Activity</span>
              <button
                class="p-1 rounded"
                :style="{ color: 'var(--ink-2)' }"
                @click="eventLogOpen = false"
              >
                <UIcon name="i-lucide-x" class="size-4" />
              </button>
            </div>
            <ActivityEventLog class="flex-1" />
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
