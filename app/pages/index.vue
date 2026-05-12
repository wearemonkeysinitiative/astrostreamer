<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { mode, setMode } = useMode()
const { state } = useCameraState()

const capturing = ref(false)
const detectActive = ref(false)
</script>

<template>
  <div class="flex-1 flex flex-col">
    <!-- Main content area -->
    <div
      class="flex-1 grid"
      :style="{
        gridTemplateColumns: mode === 'chill' ? '1fr' : 'minmax(0, 1fr) 360px'
      }"
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

      <!-- Right: Event Log (manual/astro) -->
      <ActivityEventLog v-if="mode !== 'chill'" />
    </div>
  </div>
</template>
