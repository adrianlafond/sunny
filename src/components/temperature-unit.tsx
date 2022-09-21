import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext } from '../contexts'

export const TemperatureUnit = () => {
  const { forecast, fetchForecast } = useContext(ForecastContext)

  function handleClick () {
    fetchForecast({
      temperatureUnit: forecast?.temperatureUnit === 'F' ? 'C' : 'F'
    })
  }

  return forecast != null
    ? (
      <button
        onClick={handleClick}
      >
        {forecast.temperatureUnit}&deg;
        <span class="text-sm">
          {`Toggle to ${forecast.temperatureUnit === 'F' ? 'C' : 'F'}°`}</span>
        <span></span>
      </button>
      )
    : null
}
