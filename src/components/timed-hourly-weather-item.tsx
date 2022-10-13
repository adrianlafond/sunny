import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { HourlyForecast } from '../services'
import { HourlyWeatherItem } from './hourly-weather-item'

export interface TimedHourlyWeatherItemProps extends HourlyForecast {
  showAfter: number
}

export const TimedHourlyWeatherItem = ({
  showAfter,
  ...hourlyWeatherProps
}: TimedHourlyWeatherItemProps) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, showAfter)
    return () => clearTimeout(timeout)
  }, [showAfter])

  return show ? <HourlyWeatherItem {...hourlyWeatherProps} /> : null
}
