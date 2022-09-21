import { Fragment, h } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { ForecastContext } from '../contexts'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { TimedHourlyWeatherItem } from './timed-hourly-weather-item'

export const PastWeather = () => {
  const { showForecast } = useAppSelector((state: RootState) => state.ui)
  const { forecast } = useContext(ForecastContext)

  if (!showForecast || !(forecast != null)) {
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
    <Fragment>
      <button onClick={togglePastWeather}>
        {showing ? 'Hide' : 'Show'} past weather
      </button>
      <ul>
        {filtered.map((item, index) => (
          <TimedHourlyWeatherItem key={item.time} showAfter={index * 60 + 60} {...item} />
        ))}
      </ul>
    </Fragment>
  )
}
