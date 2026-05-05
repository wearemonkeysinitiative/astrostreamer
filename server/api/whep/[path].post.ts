export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const config = useRuntimeConfig()
  const webrtcUrl = config.public.webrtcUrl

  if (!webrtcUrl) {
    throw createError({ statusCode: 500, statusMessage: 'MEDIAMTX_WEBRTC_URL not configured' })
  }

  const body = await readRawBody(event)

  const response = await $fetch.raw(`${webrtcUrl}/${path}/whep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp' },
    body
  })

  setResponseHeader(event, 'Content-Type', 'application/sdp')
  return response._data
})
