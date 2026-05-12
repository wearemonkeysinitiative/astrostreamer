export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: 'key parameter is required' })
  }

  if (isMockMode()) {
    const entry = getMockConfig(key)
    if (!entry) {
      throw createError({ statusCode: 404, statusMessage: `Config key "${key}" not found` })
    }
    return entry
  }

  const config = useRuntimeConfig()
  try {
    return await $fetch(`${config.cameraServiceUrl}/config/${key}`)
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: `Camera service error: ${err.message}`
    })
  }
})
