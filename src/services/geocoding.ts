

const API = 'https://geocoding-api.open-meteo.com/v1/search?name=';

// Raw response from Open-Meteo Geocoding API
type RawResponse  = RawResponseLocation[];

// Partial raw response from Open-Meteo Geocoding API for a location
interface RawResponseLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string; // state for United States, province for Canada, etc
  timezone: string;
}
