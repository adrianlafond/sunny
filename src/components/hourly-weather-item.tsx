import { h } from 'preact'
import { memo } from 'preact/compat'
import { useContext } from 'preact/hooks'
import { format } from 'date-fns'
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
    <li class="bg-light rounded-xl px-4 py-2 my-1">
      {format(new Date(time), 'h:mm bbb')} {temperature} {forecast.temperatureUnit}&deg;
      / Feels like: {apparentTemperature} {forecast.temperatureUnit}&deg;
    </li>
      )
    : null
}

export const HourlyWeatherItem = memo(HourlyWeatherItemComponent)
