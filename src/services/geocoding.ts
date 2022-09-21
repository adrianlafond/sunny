export const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1'

export type Locations = Location[]

export interface Location extends Omit<RawLocation, 'admin1'>{
  state: string
}

// Raw response from Open-Meteo Geocoding API
export type RawLocations = RawLocation[]

// Partial raw response from Open-Meteo Geocoding API for a location
export interface RawLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  country: string
  admin1: string // state for United States, province for Canada, etc
  timezone: string
}

export function convertGeocodingJsonToData (json: RawLocations): Locations {
  return json.map((location: RawLocation) => ({
    id: location.id,
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    country: location.country,
    state: location.admin1,
    timezone: location.timezone
  }))
}

export async function fetchLocations (name: string) {
  try {
    const URL = `${GEOCODING_API}/search?name=${name}`
    const resp = await window.fetch(URL)
    if (resp.status === 200) {
      const json = await resp.json()
      const data = convertGeocodingJsonToData(json.results)
      return { error: false, data }
    }
    return { error: true }
  } catch (error) {
    return { error: true }
  }
}
