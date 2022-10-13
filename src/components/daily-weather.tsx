import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { ForecastContext } from '../contexts'
import { DayWeather } from './day-weather'

export const DailyWeather = () => {
  const { forecast } = useContext(ForecastContext)

  if (!(forecast != null)) {
    return null
  }

  const { daily } = forecast

  return (
    <div>
      {daily.map(day => (
        <DayWeather day={day} />
      ))}
    </div>
  )
}
