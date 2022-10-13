import { useCallback, useState } from 'preact/hooks'
import { ForecastContextContract } from '../contexts'
import { ForecastParams } from '../services'
import { fetchForecast as fetchForecastService } from '../services/forecast'

export function useFetchForecast () {
  const asyncFetchForecast = useCallback(async (params?: ForecastParams) => {
    const resp = await fetchForecastService(params)
    setForecastContext({
      ...forecastContext,
      isError: resp.error,
      isLoading: false,
      forecast: resp.data
    })
  }, [])

  const fetchForecast = useCallback((params?: ForecastParams) => {
    setForecastContext({
      ...forecastContext,
      isError: false,
      isLoading: true
    })
    asyncFetchForecast(params).catch(console.error)
  }, [])

  const [forecastContext, setForecastContext] =
    useState<ForecastContextContract>({
      isError: false,
      isLoading: false,
      fetchForecast
    })

  return forecastContext
}
