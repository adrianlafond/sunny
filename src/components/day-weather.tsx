import { h } from 'preact'
import { useContext } from 'preact/hooks'
import format from 'date-fns/format'
import { DailyForecast, HourlyForecast } from '../services'
import { en } from '../lang/en'
import { ForecastContext } from '../contexts'
import clsx from 'clsx'

export interface DayWeatherProps {
  day: DailyForecast
}

const halfHour = 1000 * 60 * 30

export const DayWeather = ({ day }: DayWeatherProps) => {
  const { forecast } = useContext(ForecastContext)

  if (!(forecast != null)) {
    return null
  }

  const today = new Date(day.date).getDate()
  const hours: HourlyForecast[] = []
  for (let i = 0; i < forecast.hourly.length; i++) {
    if (new Date(forecast.hourly[i].time).getDate() === today) {
      hours.push(forecast.hourly[i])
    } else if (forecast.hourly[i].time > day.date) {
      break
    }
  }

  return (
    <div class="my-8 text-primary">
      <div class="mb-2">
        <h3 class="inline-block text-2xl mr-3">
          {format(new Date(day.date), 'ccc MMM d')}
        </h3>
        <p class="inline-block">
          <span class="whitespace-nowrap mr-3">
            Dawn: {format(new Date(day.dawn), 'h:mm aaa')}
          </span>
          <span class="whitespace-nowrap mr-3">
            Dusk: {format(new Date(day.dusk), 'h:mm aaa')}
          </span>
          <span class="whitespace-nowrap">{en.weather[day.weatherCode]}</span>
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
