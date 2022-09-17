import { ForecastState, Preferences } from '../features'
import { getDefaultForecast } from '../contexts/forecast'

export function restoreForecasts () {
  if (typeof window !== 'undefined') {
    const storage = window.localStorage.getItem('forecasts')
    if (storage) {
      return JSON.parse(storage) as ForecastState[]
    }
  }
  return [getDefaultForecast()]
}

export function storeForecasts (forecasts: ForecastState[]) {
  if (typeof window !== 'undefined') {
    const store = forecasts.map(f => ({
      ...f,
      error: null,
      loading: false
    }))
    window.localStorage.setItem('forecasts', JSON.stringify(store))
  }
}

export function restorePreferences () {
  if (typeof window !== 'undefined') {
    const storage = window.localStorage.getItem('preferences')
    if (storage) {
      return JSON.parse(storage) as Preferences
    }
  }
  return null
}

export function storePreferences (preferences: Preferences) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('preferences', JSON.stringify(preferences))
  }
}
