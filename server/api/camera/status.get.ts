export default defineEventHandler(async () => {
  if (isMockMode()) {
    return MOCK_STATUS
  }

  const config = useRuntimeConfig()
  try {
    return await $fetch(`${config.cameraServiceUrl}/status`)
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: `Camera service unreachable: ${err.message}`
    })
  }
})
