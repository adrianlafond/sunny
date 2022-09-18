import { h } from 'preact'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { WeatherCode } from '../constants'

export const CurrentWeather = () => {
  const { temperatureUnit } = useAppSelector((state: RootState) => state.forecast)
  const { time, temperature, weatherCode } = useAppSelector((state: RootState) => state.forecast.currentWeather)
  const { showForecast } = useAppSelector((state: RootState) => state.ui)

  return showForecast
    ? (
      <div>
        <h3 class="text-9xl">
          {isNaN(temperature) ? '-' : temperature} {temperatureUnit}&deg;
        </h3>
        <p>
          {new Date(time).toLocaleString()} / {WeatherCode[weatherCode]}
        </p>
      </div>
      )
    : null
}
