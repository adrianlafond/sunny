
const API = 'https://geocoding-api.open-meteo.com/v1/search?name=';

export type Locations = Location[];

export interface Location extends Omit<RawResponseLocation, 'admin1'>{
  state: string;
}

// Raw response from Open-Meteo Geocoding API
type RawResponse  = RawResponseLocation[];

// Partial raw response from Open-Meteo Geocoding API for a location
interface RawResponseLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string; // state for United States, province for Canada, etc
  timezone: string;
}

export interface LocationResponse {
  error: number | null;
  data?: Locations;
}

let throttleTimeout = 0;

/**
 * Fetches latitude and longitude locations for an input, throttled to limit the
 * number of fetches.
 */
export async function getLocationCoords(input: string): Promise<LocationResponse> {
  const lastInput = input;
  clearTimeout(throttleTimeout);
  return new Promise(resolve => {
    throttleTimeout = window.setTimeout(async () => {
      const response = await fetchLocationCoords(lastInput);
      resolve(response);
    }, 500);
  });
}

async function fetchLocationCoords(input: string): Promise<LocationResponse> {
  try {
    const response = await fetch(`${API}${input}`);
    if (response.status === 200) {
      const json = await response.json();
      return {
        error: null,
        data: convertJsonToData(json.results),
      }
    }
    return {
      error: response.status,
    };
  } catch (error) {
    return {
      error: 400,
    };
  }
}

function convertJsonToData(json: RawResponse): Locations {
  return json.map(location => ({
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    country: location.country,
    state: location.admin1,
    timezone: location.timezone,
  }));
}