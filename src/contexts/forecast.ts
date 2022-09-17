import { createContext } from 'preact'
import { WeatherCode } from '../constants'

export interface Forecast {
  elevation: number
  utcOffsetSeconds: number
  temperatureUnit: 'C' | 'F'
  hourly: Array<{
    time: number
    temperature: number
    apparentTemperature: number
    precipitation: number
    snowDepth: number
    weatherCode: WeatherCode
  }>
  currentWeather: {
    time: number
    temperature: number
    windSpeed: number
    windDirection: number
    weatherCode: WeatherCode
  }
  daily: Array<{
    dawn: number
    dusk: number
    date: number
    weatherCode: WeatherCode
  }>
  timestamp: number
}

export const ForecastContext = createContext<Forecast>(getDefaultForecast())

/**
 * Returns a default forecast value so something can initially show.
 */
export function getDefaultForecast (): Forecast {
  return {
    elevation: 0,
    utcOffsetSeconds: 0,
    temperatureUnit: 'C',
    hourly: [],
    currentWeather: {
      time: new Date().valueOf(),
      temperature: 0 / 0,
      windSpeed: 0,
      windDirection: 0,
      weatherCode: 0
    },
    daily: [],
    timestamp: new Date(0).valueOf()
  }
}
