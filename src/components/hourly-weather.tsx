import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { clsx } from 'clsx'
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

  const className = clsx('transition-searching', {
    'opacity-0': hideForecast,
    'cursor-default': hideForecast
  })

  return (
    <div class={className}>
      <ul>
        {filtered.map(item => (
          <HourlyWeatherItem key={item.time} {...item} />
        ))}
      </ul>
    </div>
  )
}
