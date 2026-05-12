export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.key || body.value === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'key and value are required' })
  }

  const bus = useEventBus()

  if (isMockMode()) {
    const ok = setMockConfig(body.key, body.value)
    if (!ok) {
      throw createError({ statusCode: 400, statusMessage: `Invalid config: ${body.key}=${body.value}` })
    }
    // Push event to SSE
    bus.push({
      kind: 'setting',
      message: `${body.key} set`,
      detail: body.value
    })
    return { ok: true }
  }

  const config = useRuntimeConfig()
  try {
    const result = await $fetch(`${config.cameraServiceUrl}/config/${body.key}`, {
      method: 'POST',
      body: { value: body.value }
    })

    // Camera service will push its own event via /api/events/push
    return result
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: `Camera service error: ${err.message}`
    })
  }
})
