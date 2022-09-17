import { createContext } from 'preact'
import { RawResponseLocation } from '../services/geocoding'

export interface Location extends Omit<RawResponseLocation, 'admin1'>{
  state: string
}

export function getDefaultLocation (): Location {
  return {
    name: 'Brooklyn',
    latitude: 40.6501,
    longitude: -73.94958,
    country: 'United States',
    state: 'New York',
    timezone: 'America/New_York'
  }
}

export const LocationContext = createContext<Location>(getDefaultLocation())
