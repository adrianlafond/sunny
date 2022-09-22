import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext } from '../contexts'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'

export const TemperatureUnit = () => {
  const { hideForecast } = useAppSelector((state: RootState) => state.ui)
  const { forecast, fetchForecast } = useContext(ForecastContext)

  function handleClick () {
    fetchForecast({
      temperatureUnit: forecast?.temperatureUnit === 'F' ? 'C' : 'F'
    })
  }

  return forecast != null
    ? (
    <button onClick={handleClick} disabled={hideForecast}>
      {forecast.temperatureUnit}&deg;
      <span class="text-sm">
        {`Toggle to ${forecast.temperatureUnit === 'F' ? 'C' : 'F'}°`}
      </span>
      <span></span>
    </button>
      )
    : null
}
