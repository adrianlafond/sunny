import { h } from 'preact'
import { useContext } from 'preact/hooks'

import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { WeatherCode } from '../constants'
import { TemperatureUnit } from './temperature-unit'
import { ForecastContext } from '../contexts'

export const CurrentWeather = () => {
  const { showForecast } = useAppSelector((state: RootState) => state.ui)

  if (!showForecast) {
    return null
  }

  const { isError, isLoading, forecast } = useContext(ForecastContext)

  if (isError) {
    return (
      <p>
        An error occurred. Check your internet connection and try again.
      </p>
    )
  }

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  }

  if (forecast != null) {
    const { time } = forecast.currentWeather
    const currentHourly = forecast.hourly.find(item => item.time === time)
    const { temperature, apparentTemperature, weatherCode } =
      currentHourly != null
        ? currentHourly
        : {
            temperature: '-',
            apparentTemperature: '-',
            weatherCode: 0
          }

    return (
      <div>
        <h3 class="text-9xl">
          {temperature} <TemperatureUnit />
        </h3>
        <p>
          Feels like: {apparentTemperature} <TemperatureUnit />
        </p>
        <p>
          {new Date(time).toLocaleString()} / {WeatherCode[weatherCode]}
        </p>
      </div>
    )
  }

  return null
}
