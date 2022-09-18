import { h } from 'preact'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { HourlyWeatherItem } from './hourly-weather-item'

export interface HourWeatherProps {
  relativeToCurrent: 'before' | 'after'
}

export const HourlyWeather = ({ relativeToCurrent }: HourWeatherProps) => {
  const { showForecast } = useAppSelector((state: RootState) => state.ui)

  const { currentTime, hourly } = useAppSelector((state: RootState) => ({
    currentTime: state.forecast.currentWeather.time,
    hourly: state.forecast.hourly
  }))

  const filtered = hourly.filter(item => relativeToCurrent === 'before'
    ? item.time < currentTime
    : item.time > currentTime)

  return showForecast
    ? <ul>{filtered.map(item => <HourlyWeatherItem key={item.time} {...item} />)}</ul>
    : null
}
