import { h } from 'preact'
import { memo } from 'preact/compat'
import { useContext, useState } from 'preact/hooks'
import { ForecastContext, LocationSearchContext } from '../contexts'
import { TimedHourlyWeatherItem } from './timed-hourly-weather-item'

export const PastWeather = memo(() => {
  const { forecast } = useContext(ForecastContext)
  const hideForecast = useContext(LocationSearchContext)

  if (!(forecast != null)) {
    return null
  }

  const [showing, setShowing] = useState(false)

  const { time: currentTime } = forecast?.currentWeather
  const { hourly } = forecast

  const filtered = showing ? hourly.filter(item => item.time < currentTime) : []

  function togglePastWeather () {
    setShowing(!showing)
  }

  return (
    <div class="relative bg-light rounded-xl p-4 mb-1">
      <button onClick={togglePastWeather} disabled={hideForecast}>
        {showing ? 'Hide' : 'Show'} past weather
      </button>
      <ul>
        {filtered.map((item, index) => (
          <TimedHourlyWeatherItem
            key={item.time}
            showAfter={index * 60 + 60}
            {...item}
          />
        ))}
      </ul>
      {hideForecast ? <div class="absolute top-0 left-0 w-full h-full bg-disabled-overlay opacity-50" /> : null}
    </div>
  )
})
