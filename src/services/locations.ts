import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
    baseUrl: 'https://geocoding-api.open-meteo.com/v1/search?name=',
  }),
  endpoints: builder => ({
    getLocationCoords: builder.query<RawResponse, string>({
      query: (input: string) => input,
    }),
  }),
});

export const { useGetLocationCoordsQuery } = locationsApi;
