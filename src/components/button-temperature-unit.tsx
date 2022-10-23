import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext, LocationSearchContext } from '../contexts'

export const ButtonTemperatureUnit = () => {
  const hideForecast = useContext(LocationSearchContext)
  const { forecast, fetchForecast } = useContext(ForecastContext)

  function handleClick () {
    fetchForecast({
      temperatureUnit: forecast?.temperatureUnit === 'F' ? 'C' : 'F'
    })
  }

  return forecast != null
    ? (
    <button
      class="hover:bg-white bg-stone-100 text-blue-500 rounded border-stone-400 border px-2 pb-2"
      onClick={handleClick}
      disabled={hideForecast}
    >
      {forecast.temperatureUnit}&deg;
      <span class="text-sm block">
        {`Toggle to ${forecast.temperatureUnit === 'F' ? 'C' : 'F'}°`}
      </span>
    </button>
      )
    : null
}
