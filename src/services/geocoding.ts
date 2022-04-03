

const API = 'https://geocoding-api.open-meteo.com/v1/search?name=';

// Raw response from Open-Meteo Geocoding API
type RawResponse  = RawResponseLocation[];

// Partial raw response from Open-Meteo Geocoding API for a location
interface RawResponseLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string; // https://en.wikipedia.org/wiki/List_of_FIPS_country_codes
  timezone: string;
}
