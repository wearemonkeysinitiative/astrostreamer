export default defineEventHandler(async () => {
  const { weatherApiKey } = useRuntimeConfig()

  if (!weatherApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'WEATHER_API_KEY not configured' })
  }

  const data = await $fetch<Record<string, any>>(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      query: {
        lat: 57.6261,
        lon: 39.8845,
        appid: weatherApiKey,
        units: 'metric',
        lang: 'ru'
      }
    }
  )

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    wind: data.wind.speed,
    humidity: data.main.humidity,
    clouds: data.clouds.all
  }
})
