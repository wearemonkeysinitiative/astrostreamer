export default defineEventHandler(async () => {
  const { weatherApiKey, weatherLat, weatherLon } = useRuntimeConfig()

  if (!weatherApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'WEATHER_API_KEY not configured' })
  }

  let data: Record<string, any>
  try {
    data = await $fetch<Record<string, any>>(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        query: {
          lat: weatherLat,
          lon: weatherLon,
          appid: weatherApiKey,
          units: 'metric',
          lang: 'ru'
        }
      }
    )
  } catch (err: any) {
    const status = err?.response?.status || err?.statusCode || 500
    if (status === 401) {
      throw createError({ statusCode: 401, statusMessage: 'OpenWeatherMap: неверный или ещё не активированный API-ключ' })
    }
    throw createError({ statusCode: status, statusMessage: `OpenWeatherMap error: ${err.message || status}` })
  }

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
