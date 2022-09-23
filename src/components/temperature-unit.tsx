import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext, LocationSearchContext } from '../contexts'

export const TemperatureUnit = () => {
  const hideForecast = useContext(LocationSearchContext)
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
