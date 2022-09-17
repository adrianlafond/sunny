import { h } from 'preact'
import { useAppSelector } from '../hooks'
import { RootState } from '../store'
import { WeatherCode } from '../constants'

export const CurrentForecast = () => {
  const { temperatureUnit } = useAppSelector((state: RootState) => state.forecast)
  const { time, temperature, weatherCode } = useAppSelector((state: RootState) => state.forecast.currentWeather)
  const { showForecast } = useAppSelector((state: RootState) => state.ui)

  console.log('CurrentForecast.render()')

  return showForecast && (
    <div>
      <h3>
        {temperature} {temperatureUnit}&deg;
      </h3>
      <p>
        {new Date(time).toLocaleString()} / {WeatherCode[weatherCode]}
      </p>
    </div>
  )
}
