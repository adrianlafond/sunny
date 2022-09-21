import { Api, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  buildForecastUrl,
  convertForecastJsonToData,
  Forecast,
  ForecastParams,
  RawForecastResponse
} from './forecast'
import {
  GEOCODING_API,
  convertGeocodingJsonToData,
  Locations,
  RawLocations
} from './geocoding'

/*
type Api<BaseQuery extends BaseQueryFn<any, unknown, unknown, {}, {}>, Definitions extends EndpointDefinitions, ReducerPath extends string, TagTypes extends string, Enhancers extends keyof ApiModules<any, any, any, any> = typeof coreModuleName> = UnionToIntersection<ApiModules<BaseQuery, Definitions, ReducerPath, TagTypes>[Enhancers]> & {
    ...;
} */
// Api<any, any, any, any, any>

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
    getForecast: builder.query<Forecast, ForecastParams>({
      query: (props: ForecastParams) => buildForecastUrl(props),

      transformResponse: (response: RawForecastResponse) => convertForecastJsonToData(response)
    })
  })
})

export const {
  useGetForecastQuery,
  useLazyGetForecastQuery,
  useLazyGetLocationCoordsQuery
} = api
