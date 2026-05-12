export default defineEventHandler(async () => {
  if (isMockMode()) {
    return listMockConfig()
  }

  const config = useRuntimeConfig()
  try {
    return await $fetch(`${config.cameraServiceUrl}/config/list`)
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: `Camera service unreachable: ${err.message}`
    })
  }
})
