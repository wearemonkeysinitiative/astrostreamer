<script setup lang="ts">
import type { AppMode } from '~/composables/useMode'

const props = withDefaults(defineProps<{
  streamPath?: string
  mode?: AppMode
}>(), {
  streamPath: 'canon',
  mode: 'manual'
})

const config = useRuntimeConfig()
const videoRef = ref<HTMLVideoElement>()
const status = ref<'connecting' | 'live' | 'error'>('connecting')
const pc = ref<RTCPeerConnection | null>(null)

let reconnectTimeout: ReturnType<typeof setTimeout> | undefined

async function connect() {
  status.value = 'connecting'
  cleanup()

  try {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    pc.value = peerConnection

    peerConnection.addTransceiver('video', { direction: 'recvonly' })
    peerConnection.addTransceiver('audio', { direction: 'recvonly' })

    peerConnection.ontrack = (event) => {
      if (videoRef.value && event.streams[0]) {
        videoRef.value.srcObject = event.streams[0]
      }
    }

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState
      if (state === 'connected') {
        status.value = 'live'
      } else if (state === 'failed' || state === 'disconnected') {
        status.value = 'error'
        scheduleReconnect()
      }
    }

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    if (peerConnection.iceGatheringState !== 'complete') {
      await new Promise<void>((resolve) => {
        const check = () => {
          if (peerConnection.iceGatheringState === 'complete') {
            peerConnection.removeEventListener('icegatheringstatechange', check)
            resolve()
          }
        }
        peerConnection.addEventListener('icegatheringstatechange', check)
        setTimeout(resolve, 3000)
      })
    }

    const whepUrl = `/api/whep/${props.streamPath}/whep`
    const response = await fetch(whepUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sdp' },
      body: peerConnection.localDescription?.sdp
    })

    if (!response.ok) {
      throw new Error(`WHEP error: ${response.status}`)
    }

    const answerSdp = await response.text()
    await peerConnection.setRemoteDescription({
      type: 'answer',
      sdp: answerSdp
    })
  } catch (err) {
    console.error('[VideoStream] Connection failed:', err)
    status.value = 'error'
    scheduleReconnect()
  }
}

function cleanup() {
  if (pc.value) {
    pc.value.close()
    pc.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

function scheduleReconnect() {
  clearTimeout(reconnectTimeout)
  reconnectTimeout = setTimeout(connect, 5000)
}

onMounted(connect)

onBeforeUnmount(() => {
  clearTimeout(reconnectTimeout)
  cleanup()
})
</script>

<template>
  <div
    class="relative w-full min-h-[300px] lg:min-h-[460px] overflow-hidden rounded-lg"
    :class="props.mode === 'astro' ? 'sky-bright' : 'sky'"
    :style="{ border: '1px solid var(--line)' }"
  >
    <!-- Grid overlay -->
    <div class="absolute inset-0 grid-lines pointer-events-none" />

    <!-- Milky Way effect (astro only) -->
    <div v-if="props.mode === 'astro'" class="milky-way" />

    <!-- Video element -->
    <video
      ref="videoRef"
      autoplay
      muted
      playsinline
      class="relative w-full h-full object-contain z-[1]"
    />

    <!-- Connection status (when not live) -->
    <div
      v-if="status !== 'live'"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 z-[2]"
      style="color: var(--ink-3)"
    >
      <UIcon
        :name="status === 'connecting' ? 'i-lucide-loader-circle' : 'i-lucide-video-off'"
        :class="['size-8', status === 'connecting' && 'animate-spin']"
      />
      <span class="text-sm font-mono">
        {{ status === 'connecting' ? 'Подключение к стриму...' : 'Нет соединения. Переподключение...' }}
      </span>
    </div>

    <!-- Overlay slot -->
    <slot />
  </div>
</template>
