import { createContext } from 'preact'
import { Forecast, ForecastParams } from '../services'

export interface ForecastContextContract {
  isError: boolean
  isLoading: boolean
  fetchForecast: (props?: ForecastParams) => void
  forecast?: Forecast
}

export const ForecastContext = createContext<ForecastContextContract>({
  isError: false,
  isLoading: false,
  fetchForecast: (_props?: ForecastParams) => undefined
})
