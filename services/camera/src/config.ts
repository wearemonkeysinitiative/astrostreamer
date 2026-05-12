export const PORT = parseInt(process.env.PORT || '3001', 10)
export const MEDIAMTX_RTSP_URL = process.env.MEDIAMTX_RTSP_URL || 'rtsp://127.0.0.1:8554/canon'
export const NUXT_EVENTS_URL = process.env.NUXT_EVENTS_URL || 'http://127.0.0.1:3000/api/events/push'
export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || ''
export const CAPTURE_DIR = process.env.CAPTURE_DIR || '/tmp/captures'
