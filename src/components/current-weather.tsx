import { Fragment, h } from 'preact'
import { useContext } from 'preact/hooks'

import { TemperatureUnit } from './temperature-unit'
import { ForecastContext } from '../contexts'
import { en } from '../lang/en'
import { HourlyForecast } from '../services'

export const CurrentWeather = () => {
  const { isError, isLoading, forecast } = useContext(ForecastContext)

  let content: h.JSX.Element | null = null

  if (isError) {
    content = (
      <p>An error occurred. Check your internet connection and try again.</p>
    )
  }

  if (isLoading) {
    content = <p>Loading...</p>
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

    content = (
      <Fragment>
        <h3 class="text-8xl my-8">
          {temperature} <TemperatureUnit />
        </h3>
        <p>Feels like: {apparentTemperature}</p>
        <p>{en.weather[weatherCode as HourlyForecast['weatherCode']]}</p>
      </Fragment>
    )
  }

  return content
}
