
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
