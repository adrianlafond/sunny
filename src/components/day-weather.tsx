import { h } from 'preact'
import { useContext } from 'preact/hooks'
import format from 'date-fns/format'
import { DailyForecast, HourlyForecast } from '../services'
import { en } from '../lang/en'
import { ForecastContext } from '../contexts'

export interface DayWeatherProps {
  day: DailyForecast
}

export const DayWeather = ({ day }: DayWeatherProps) => {
  const { forecast } = useContext(ForecastContext)

  if (!(forecast != null)) {
    return null
  }

  const today = new Date(day.date).getDate()
  const hours: HourlyForecast[] = []
  let high = Number.MIN_SAFE_INTEGER
  let low = Number.MAX_SAFE_INTEGER
  for (let i = 0; i < forecast.hourly.length; i++) {
    const hour = forecast.hourly[i]
    if (new Date(hour.time).getDate() === today) {
      hours.push(hour)
      if (hour.temperature > high) {
        high = hour.temperature
      }
      if (hour.temperature < low) {
        low = hour.temperature
      }
    } else if (hour.time > day.date) {
      break
    }
  }

  return (
    <div class="my-8 text-primary">
      <div class="mb-2">
        <h3 class="inline-block text-2xl mr-3">
          {format(new Date(day.date), 'ccc MMM d')}
          <span class="ml-4">&uarr;{high}</span>
          <span class="ml-4">&darr;{low}</span>
        </h3>
        <p>
          <span class="inline-block mr-3">
            Dawn: {format(new Date(day.dawn), 'h:mm aaa')}
          </span>
          <span class="inline-block mr-3">
            Dusk: {format(new Date(day.dusk), 'h:mm aaa')}
          </span>
          <span class="inline-block">{en.weather[day.weatherCode]}</span>
        </p>
      </div>

      <table class="w-full">
        <thead>
          <tr>
            <th class="w-1/5 text-left text-sm font-normal">Time</th>
            <th class="w-1/5 text-left text-sm font-normal">=/~</th>
            <th class="w-3/5 text-left text-sm font-normal">Summary</th>
          </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour.time} class="border-y border-stone-400">
              <td>{format(new Date(hour.time), 'hh:mm')}</td>
              <td>
                {Math.round(hour.temperature)}/
                {Math.round(hour.apparentTemperature)}
              </td>
              <td>{en.weather[hour.weatherCode]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
