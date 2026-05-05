// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  runtimeConfig: {
    weatherApiKey: process.env.WEATHER_API_KEY,
    weatherLat: process.env.WEATHER_LAT,
    weatherLon: process.env.WEATHER_LON,
    public: {
      cameraApi: process.env.CAMERA_API_URL,
      webrtcUrl: process.env.MEDIAMTX_WEBRTC_URL,
      locationName: process.env.LOCATION_NAME,
      timezoneOffset: process.env.TIMEZONE_OFFSET
    }
  }
})
