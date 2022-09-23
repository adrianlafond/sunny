import { h } from 'preact'
import { memo } from 'preact/compat'
import { useContext } from 'preact/hooks'
import { ForecastContext } from '../contexts'
import { HourlyForecast } from '../services'

const HourlyWeatherItemComponent = (props: HourlyForecast) => {
  const {
    time,
    temperature,
    apparentTemperature
    // precipitation,
    // snowDepth,
    // weatherCode
  } = props
  const { forecast } = useContext(ForecastContext)

  return forecast != null
    ? (
    <li>
      {new Date(time).toLocaleTimeString()} {temperature} {forecast.temperatureUnit}&deg;
      / Feels like: {apparentTemperature} {forecast.temperatureUnit}&deg;
    </li>
      )
    : null
}

export const HourlyWeatherItem = memo(HourlyWeatherItemComponent)
