import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { convertJsonToData, Locations } from './geocoding';

const API = 'https://geocoding-api.open-meteo.com/v1';

// Raw response from Open-Meteo Geocoding API
type RawResponse = RawResponseLocation[];

// Partial raw response from Open-Meteo Geocoding API for a location
interface RawResponseLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string; // state for United States, province for Canada, etc
  timezone: string;
}

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API,
  }),
  endpoints: builder => ({
    getLocationCoords: builder.query<Locations, string>({
      query: (input: string) => `search?name=${input}`,

      transformResponse: (response: { results: RawResponse }) => {
        if ('results' in response) {
          const { results } = response;
          return convertJsonToData(results);
        }
        return [];
      },
    }),
  }),
});
