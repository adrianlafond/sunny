import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Location } from './location'
import { ForecastContext, LocationSearchContext } from '../contexts'
import { useFetchForecast } from '../hooks'
import { CurrentWeather } from './current-weather'
import { DailyWeather } from './daily-weather'

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
    'bg-stone-200',
    'text-stone-800',
    'w-full min-h-screen flex flex-col items-center',
    'p-4'
  ].join(' ')

  useEffect(() => {
    forecastContext.fetchForecast()
  }, [])

  return (
    <ForecastContext.Provider value={forecastContext}>
      <LocationSearchContext.Provider value={searching}>
        <main class={mainClass}>
          <div class="max-w-screen-sm w-full">
            <Location
              onSearchStart={handleSearchStart}
              onSearchEnd={handleSearchEnd}
              onSelectLocation={handleSelectLocation}
            />
            <CurrentWeather />
            <DailyWeather />
          </div>
        </main>
      </LocationSearchContext.Provider>
    </ForecastContext.Provider>
  )
}
