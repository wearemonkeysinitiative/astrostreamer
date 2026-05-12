export default defineEventHandler(async () => {
  const bus = useEventBus()

  if (isMockMode()) {
    const imgNum = String(Math.floor(Math.random() * 9000) + 1000)
    const result = {
      ok: true,
      filename: `IMG_${imgNum}.CR2`,
      size: '23.4 MB',
      format: '14-bit RAW'
    }
    bus.push({
      kind: 'capture',
      message: 'Frame captured',
      detail: `${result.filename} · ${result.format} · ${result.size}`
    })
    return result
  }

  const config = useRuntimeConfig()
  try {
    const result = await $fetch(`${config.cameraServiceUrl}/capture`, {
      method: 'POST'
    })
    // Camera service pushes its own capture event via /api/events/push
    return result
  } catch (err: any) {
    bus.push({
      kind: 'error',
      message: 'Capture failed',
      detail: err.message
    })
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: `Capture failed: ${err.message}`
    })
  }
})
