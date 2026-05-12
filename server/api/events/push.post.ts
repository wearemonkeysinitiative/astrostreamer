export default defineEventHandler(async (event) => {
  // Verify internal API key
  const config = useRuntimeConfig()
  if (config.internalApiKey) {
    const auth = getHeader(event, 'x-api-key')
    if (auth !== config.internalApiKey) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid API key' })
    }
  }

  const body = await readBody(event)

  if (!body?.kind || !body?.message) {
    throw createError({ statusCode: 400, statusMessage: 'kind and message are required' })
  }

  const bus = useEventBus()
  const pushed = bus.push({
    kind: body.kind,
    message: body.message,
    detail: body.detail,
    thumbnail: body.thumbnail
  })

  return { ok: true, event: pushed }
})
