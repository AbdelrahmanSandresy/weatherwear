import { useState, useEffect } from 'react'
import axios from 'axios'

const OWM_KEY = import.meta.env.VITE_OPENWEATHER_KEY

function mapCondition(weather, windSpeed, tempF) {
  const main = weather[0].main
  if (main === 'Snow') return 'Snowy'
  if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') return 'Rainy'
  if (windSpeed > 15) return 'Windy'
  if (tempF < 45) return 'Cold'
  if (main === 'Clear') return 'Sunny'
  return 'Cloudy'
}

export default function useWeather() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              lat: coords.latitude,
              lon: coords.longitude,
              units: 'imperial',
              appid: OWM_KEY,
            },
          })
          setWeather({
            city: data.name,
            tempF: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            condition: mapCondition(data.weather, data.wind.speed, data.main.temp),
            windSpeed: Math.round(data.wind.speed),
            humidity: data.main.humidity,
          })
        } catch {
          setError('Could not fetch weather data.')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location access denied. Enable location to see weather.')
        setLoading(false)
      },
      { timeout: 5000 }
    )
  }, [])

  return { weather, error, loading }
}
