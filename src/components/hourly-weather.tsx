import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext, LocationSearchContext } from '../contexts'
import { HourlyWeatherItem } from './hourly-weather-item'

export interface HourWeatherProps {
  relativeToCurrent: 'before' | 'after'
}

export const HourlyWeather = ({ relativeToCurrent }: HourWeatherProps) => {
  const { forecast } = useContext(ForecastContext)
  const hideForecast = useContext(LocationSearchContext)

  if (!(forecast != null)) {
    return null
  }

  const { time: currentTime } = forecast?.currentWeather
  const { hourly } = forecast

  const filtered = hourly.filter(item => relativeToCurrent === 'before'
    ? item.time < currentTime
    : item.time > currentTime)

  return (
    <div class="relative">
      <ul>{filtered.map(item => <HourlyWeatherItem key={item.time} {...item} />)}</ul>
      {hideForecast
        ? (
          <div class="absolute top-0 left-0 w-full h-full bg-disabled-overlay opacity-50" />
          )
        : null}
      </div>
  )
}
