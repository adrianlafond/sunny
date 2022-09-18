import { h } from 'preact'

import { Location } from './location'
import { Forecast } from './forecast'
import { HourlyWeather } from './hourly-weather'
import { PastWeather } from './past-weather'

export const Main = () => {
  const mainClass = [
    'bg-light',
    'dark:bg-primary',
    'w-full min-h-screen flex flex-col items-center text-primary dark:text-light'
  ].join(' ')

  return (
    <main class={mainClass}>
      <div class="max-w-screen-sm w-full mx-8">
        <PastWeather />
        <Location />
        <Forecast />
        <HourlyWeather relativeToCurrent="after" />
      </div>
    </main>
  )
}
