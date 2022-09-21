import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext } from '../contexts'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { HourlyWeatherItem } from './hourly-weather-item'

export interface HourWeatherProps {
  relativeToCurrent: 'before' | 'after'
}

export const HourlyWeather = ({ relativeToCurrent }: HourWeatherProps) => {
  const { showForecast } = useAppSelector((state: RootState) => state.ui)
  const { forecast } = useContext(ForecastContext)

  if (!showForecast || !(forecast != null)) {
    return null
  }

  const { time: currentTime } = forecast?.currentWeather
  const { hourly } = forecast

  const filtered = hourly.filter(item => relativeToCurrent === 'before'
    ? item.time < currentTime
    : item.time > currentTime)

  return <ul>{filtered.map(item => <HourlyWeatherItem key={item.time} {...item} />)}</ul>
}
