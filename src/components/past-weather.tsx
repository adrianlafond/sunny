import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { TimedHourlyWeatherItem } from './timed-hourly-weather-item'

export const PastWeather = () => {
  const { showForecast } = useAppSelector((state: RootState) => state.ui)

  if (!showForecast) {
    return null
  }

  const [showing, setShowing] = useState(false)

  const { currentTime, hourly } = useAppSelector((state: RootState) => ({
    currentTime: state.forecast.currentWeather.time,
    hourly: state.forecast.hourly
  }))

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
          <TimedHourlyWeatherItem key={item.time} showAfter={index * 150 + 150} {...item} />
        ))}
      </ul>
    </Fragment>
  )
}
