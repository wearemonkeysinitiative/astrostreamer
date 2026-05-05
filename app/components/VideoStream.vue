<script setup lang="ts">
const props = withDefaults(defineProps<{
  streamPath?: string
}>(), {
  streamPath: 'canon'
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

    // Wait for ICE gathering to complete
    if (peerConnection.iceGatheringState !== 'complete') {
      await new Promise<void>((resolve) => {
        const check = () => {
          if (peerConnection.iceGatheringState === 'complete') {
            peerConnection.removeEventListener('icegatheringstatechange', check)
            resolve()
          }
        }
        peerConnection.addEventListener('icegatheringstatechange', check)
        // Fallback timeout
        setTimeout(resolve, 3000)
      })
    }

    const whepUrl = `${config.public.webrtcUrl}/${props.streamPath}/whep`
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
  <UCard class="overflow-hidden">
    <div class="relative aspect-video bg-black rounded">
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="w-full h-full object-contain"
      />

      <div
        v-if="status !== 'live'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400"
      >
        <UIcon
          :name="status === 'connecting' ? 'i-lucide-loader-circle' : 'i-lucide-video-off'"
          :class="['size-8', status === 'connecting' && 'animate-spin']"
        />
        <span class="text-sm">
          {{ status === 'connecting' ? 'Подключение к стриму...' : 'Нет соединения. Переподключение...' }}
        </span>
      </div>

      <div
        v-if="status === 'live'"
        class="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded"
      >
        <span class="size-1.5 bg-white rounded-full animate-pulse" />
        LIVE
      </div>
    </div>
  </UCard>
</template>
