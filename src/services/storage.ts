import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants'
import { Location, Forecast } from '../services'

let location: Location
let temperatureUnit: Forecast['temperatureUnit']

export function save (data: Location | Forecast['temperatureUnit']) {
  let key: 'location' | 'temperatureUnit'
  if (typeof data === 'object') {
    location = data
    key = 'location'
  } else if (typeof data === 'string') {
    temperatureUnit = data
    key = 'temperatureUnit'
  } else {
    return
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(data))
  }
}

export function restoreLocation () {
  if (location != null) {
    return location
  }
  if (typeof window !== 'undefined') {
    const storage = window.localStorage.getItem('location')
    if (storage != null) {
      const data: Location = JSON.parse(storage)
      return data
    }
  }
  return {
    id: 'default',
    name: 'Brooklyn',
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    country: 'United States',
    state: 'New York',
    timezone: 'America/New_York'
  }
}

export function restoreTemperatureUnit () {
  if (temperatureUnit != null) {
    return temperatureUnit
  }
  if (typeof window !== 'undefined') {
    const storage = window.localStorage.getItem('temperatureUnit')
    if (storage != null) {
      const data: Forecast['temperatureUnit'] = JSON.parse(storage)
      return data
    }
  }
  return null
}
