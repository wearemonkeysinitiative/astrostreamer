// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'dark'
  },
  runtimeConfig: {
    weatherApiKey: process.env.WEATHER_API_KEY,
    public: {
      cameraApi: process.env.CAMERA_API_URL,
      webrtcUrl: process.env.MEDIAMTX_WEBRTC_URL
    }
  }
})
