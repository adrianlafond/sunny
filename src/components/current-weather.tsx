import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { WeatherCode } from '../constants'
import { TemperatureUnit } from './temperature-unit'
import { ForecastContext, LocationSearchContext } from '../contexts'

export const CurrentWeather = () => {
  const { isError, isLoading, forecast } = useContext(ForecastContext)
  const hideForecast = useContext(LocationSearchContext)

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
      <div class="relative">
        <h3 class="text-9xl">
          {temperature} <TemperatureUnit />
        </h3>
        <p>
          Feels like: {apparentTemperature} <TemperatureUnit />
        </p>
        <p>
          {new Date(time).toLocaleString()} / {WeatherCode[weatherCode]}
        </p>
        {hideForecast
          ? (
          <div class="absolute top-0 left-0 w-full h-full bg-disabled-overlay opacity-50" />
            )
          : null}
      </div>
    )
  }

  return null
}
