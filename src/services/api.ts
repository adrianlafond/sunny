import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants'
import { convertForecastJsonToData, Forecast, ForecastProps, RawForecastResponse } from './forecast'
import { convertGeocodingJsonToData, Locations, RawLocations } from './geocoding'

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1'

const FORECAST_API = 'https://api.open-meteo.com/v1'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery(),
  endpoints: builder => ({
    /**
     * Geocoding: get latitude and longitude for a "place" query.
     */
    getLocationCoords: builder.query<Locations, string>({
      query: (input: string) => `${GEOCODING_API}/search?name=${input}`,

      transformResponse: (response: { results: RawLocations }) => {
        if ('results' in response) {
          const { results } = response
          return convertGeocodingJsonToData(results)
        }
        return []
      }
    }),

    /**
     * Fetches forecast for latitude and longitude.
     */
    getForecast: builder.query<Forecast, ForecastProps>({
      query: (props: ForecastProps) => buildForecastUrl(props),

      transformResponse: (response: RawForecastResponse) => convertForecastJsonToData(response)
    })
  })
})

export const { useGetForecastQuery, useLazyGetLocationCoordsQuery } = api

function buildForecastUrl ({
  latitude = DEFAULT_LATITUDE,
  longitude = DEFAULT_LONGITUDE,
  hourly = ['temperature_2m', 'apparent_temperature', 'precipitation', 'snow_depth', 'weathercode'],
  temperatureUnit = 'C',
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timezone = 'America%2FNew_York',
  currentWeather = true
}: Omit<ForecastProps, 'name'> = {}) {
  return [
    FORECAST_API,
    '/forecast?',
    `latitude=${latitude}`,
    `&longitude=${longitude}`,
    `&hourly=${hourly.toString()}`,
    `&temperature_unit=${temperatureUnit === 'F' ? 'fahrenheit' : 'celsius'}`,
    `&windspeed_unit=${windSpeedUnit}`,
    `&precipitation_unit=${precipitationUnit}`,
    `&timezone=${timezone}`,
    `&current_weather=${currentWeather.toString()}`,
    '&daily=sunrise,sunset,weathercode'
  ].join('')
}
