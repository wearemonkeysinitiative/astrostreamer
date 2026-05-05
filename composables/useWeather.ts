export interface WeatherData {
  temp: number
  feelsLike: number
  description: string
  icon: string
  wind: number
  humidity: number
  clouds: number
}

export function useWeather() {
  return useFetch<WeatherData>('/api/weather', {
    key: 'weather',
    server: false,
    lazy: true,
    getCachedData(key, nuxtApp) {
      const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!cached) return undefined

      const fetchedAt = nuxtApp.payload._fetchedAt?.[key]
      if (fetchedAt && Date.now() - fetchedAt > 15 * 60 * 1000) {
        return undefined
      }
      return cached
    }
  })
}
