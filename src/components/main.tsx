import { h } from 'preact'
import { useEffect } from 'preact/hooks'

import { Location } from './location'
import { HourlyWeather } from './hourly-weather'
import { PastWeather } from './past-weather'
import { ForecastContext } from '../contexts'
import { useFetchForecast } from '../hooks'
import { CurrentWeather } from './current-weather'

export const Main = () => {
  const forecastContext = useFetchForecast()

  function handleSelectLocation (latitude: number, longitude: number) {
    forecastContext.fetchForecast({ latitude, longitude })
  }

  const mainClass = [
    'bg-light dark:bg-primary',
    'text-primary dark:text-light',
    'w-full min-h-screen flex flex-col items-center'
  ].join(' ')

  useEffect(() => {
    console.log('?')
    forecastContext.fetchForecast()
  }, [])

  return (
    <ForecastContext.Provider value={forecastContext}>
      <main class={mainClass}>
        <div class="max-w-screen-sm w-full mx-8">
          <PastWeather />
          <Location onSelectLocation={handleSelectLocation} />
          <CurrentWeather />
          <HourlyWeather relativeToCurrent="after" />
        </div>
      </main>
    </ForecastContext.Provider>
  )
}
