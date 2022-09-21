import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { closestTo, isAfter, isBefore } from 'date-fns'
import { updateForecast, updateTheme } from '../features'
import { useAppDispatch, useAppSelector } from '../hooks'
import { DailyForecast, useGetForecastQuery } from '../services'
import { RootState } from '../store'
import { CurrentWeather } from './current-weather'

export const Forecast = () => {
  const dispatch = useAppDispatch()

  // TODO: memoize the selector @ https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#memoizing-selectors-with-createselector
  const latitude = useAppSelector((state: RootState) => state.location.latitude)
  const longitude = useAppSelector((state: RootState) => state.location.longitude)
  const temperatureUnit = useAppSelector((state: RootState) => state.forecast.temperatureUnit)

  const { data, error, isLoading } = useGetForecastQuery({
    latitude,
    longitude,
    temperatureUnit
  })

  console.log('Forecast.render()', isLoading)

  useEffect(() => {
    if (data != null) {
      const today = new Date()
      const dailyDate = closestTo(
        today,
        data.daily.map((daily: DailyForecast) => daily.date)
      )
      const dailyWeather = data.daily.find(
        daily => daily.date === dailyDate?.valueOf()
      )
      if (dailyWeather != null) {
        const { dawn, dusk } = dailyWeather
        const isDay = isAfter(today, dawn) && isBefore(today, dusk)
        if (isDay) {
          document.querySelector('html')?.classList.remove('dark')
        } else {
          document.querySelector('html')?.classList.add('dark')
        }
        dispatch(updateTheme(isDay ? 'day' : 'night'))
      }
      dispatch(updateForecast(data))
    }
  }, [data])

  if (error != null) {
    return (
      <p>An error occurred. Check your internet connection and try again.</p>
    )
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (data != null) {
    return <CurrentWeather />
  }

  return null
}
