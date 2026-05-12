// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'IBM Plex Sans', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', weights: [400, 500, 600, 700] },
      { name: 'Cormorant Garamond', weights: [500, 600], styles: ['italic'] }
    ]
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  runtimeConfig: {
    weatherApiKey: process.env.WEATHER_API_KEY,
    weatherLat: process.env.WEATHER_LAT,
    weatherLon: process.env.WEATHER_LON,
    cameraServiceUrl: process.env.CAMERA_SERVICE_URL || 'http://127.0.0.1:3001',
    internalApiKey: process.env.INTERNAL_API_KEY || '',
    public: {
      appVersion: process.env.npm_package_version || '0.4',
      cameraApi: process.env.CAMERA_API_URL,
      webrtcUrl: process.env.MEDIAMTX_WEBRTC_URL,
      locationName: process.env.LOCATION_NAME,
      timezoneOffset: process.env.TIMEZONE_OFFSET,
      mockCamera: process.env.MOCK_CAMERA === 'true' || process.env.MOCK_CAMERA === '1'
    }
  }
})
