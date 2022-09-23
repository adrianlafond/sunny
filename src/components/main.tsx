import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Location } from './location'
import { HourlyWeather } from './hourly-weather'
import { PastWeather } from './past-weather'
import { ForecastContext, LocationSearchContext } from '../contexts'
import { useFetchForecast } from '../hooks'
import { CurrentWeather } from './current-weather'

export const Main = () => {
  const forecastContext = useFetchForecast()

  const [searching, setSearching] = useState(false)

  function handleSelectLocation (latitude: number, longitude: number) {
    forecastContext.fetchForecast({ latitude, longitude })
  }

  function handleSearchStart () {
    setSearching(true)
  }

  function handleSearchEnd () {
    setSearching(false)
  }

  const mainClass = [
    'bg-light dark:bg-primary',
    'text-primary dark:text-light',
    'w-full min-h-screen flex flex-col items-center'
  ].join(' ')

  useEffect(() => {
    forecastContext.fetchForecast()
  }, [])

  return (
    <ForecastContext.Provider value={forecastContext}>
      <LocationSearchContext.Provider value={searching}>
        <main class={mainClass}>
          <div class="max-w-screen-sm w-full mx-8">
            <PastWeather />
            <Location
              onSearchStart={handleSearchStart}
              onSearchEnd={handleSearchEnd}
              onSelectLocation={handleSelectLocation}
            />
            <CurrentWeather />
            <HourlyWeather relativeToCurrent="after" />
          </div>
        </main>
      </LocationSearchContext.Provider>
    </ForecastContext.Provider>
  )
}
