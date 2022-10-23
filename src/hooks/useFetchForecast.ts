import { useCallback, useRef, useState } from 'preact/hooks'
import { ForecastContextContract } from '../contexts'
import { ForecastParams } from '../services'
import { fetchForecast as fetchForecastService } from '../services/forecast'

const TEN_MINUTES = 10 * 60 * 1000

export function useFetchForecast () {
  const paramsRef = useRef<ForecastParams>()
  const refetchRef = useRef(0)

  const refetchForecast = useCallback((params?: ForecastParams) => {
    paramsRef.current = params
    window.clearTimeout(refetchRef.current)
    refetchRef.current = window.setTimeout(() => {
      fetchForecast(paramsRef.current)
    }, TEN_MINUTES)
  }, [])

  const asyncFetchForecast = useCallback(async (params?: ForecastParams) => {
    const resp = await fetchForecastService(params)
    setForecastContext({
      ...forecastContext,
      isError: resp.error,
      isLoading: false,
      forecast: resp.data
    })
    refetchForecast(params)
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
