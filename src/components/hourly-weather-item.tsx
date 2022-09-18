import { h } from 'preact'
import { useAppSelector } from '../hooks'
import { HourlyForecast } from '../services'
import { RootState } from '../store'

export const HourlyWeatherItem = ({
  time,
  temperature,
  apparentTemperature,
  precipitation,
  snowDepth,
  weatherCode
}: HourlyForecast) => {
  const { temperatureUnit } = useAppSelector((state: RootState) => state.forecast)

  return (
    <li>
      {new Date(time).toLocaleTimeString()} {temperature} {temperatureUnit}&deg; / Feels like: {apparentTemperature} {temperatureUnit}&deg;
    </li>
  )
}
