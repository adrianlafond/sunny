import { h } from 'preact'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { WeatherCode } from '../constants'

export const CurrentWeather = () => {
  const { showForecast } = useAppSelector((state: RootState) => state.ui)

  if (!showForecast) {
    return null
  }

  const { temperatureUnit } = useAppSelector((state: RootState) => state.forecast)
  const { time } = useAppSelector((state: RootState) => state.forecast.currentWeather)
  const {
    temperature,
    apparentTemperature,
    weatherCode
  } = useAppSelector((state: RootState) => {
    const currentHourly = state.forecast.hourly.find(item => item.time === time)
    return currentHourly != null
      ? currentHourly
      : {
          temperature: '-',
          apparentTemperature: '-',
          weatherCode: 0
        }
  })

  return (
    <div>
      <h3 class="text-9xl">
        {temperature} {temperatureUnit}&deg;
      </h3>
      <p>
        Feels like: {apparentTemperature} {temperatureUnit}&deg;
      </p>
      <p>
        {new Date(time).toLocaleString()} / {WeatherCode[weatherCode]}
      </p>
    </div>
  )
}
