import { h } from 'preact'
import { useRef, useState } from 'preact/hooks'
import { memo } from 'preact/compat'
import throttle from 'lodash.throttle'
import { useAppDispatch, useFetchLocations } from '../hooks'
import { LocationOption } from './location-option'
import { hideForecast, showForecast } from '../features'
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants'
import { Location } from '../services'

export interface LocationProps {
  onSelectLocation: (latitude: number, longitude: number) => void
}

const LocationInput = memo(({ onSelectLocation }: LocationProps) => {
  const dispatch = useAppDispatch()

  const [location, setLocation] = useState<Location>({
    id: 'default',
    name: 'Brooklyn',
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    country: 'United States',
    state: 'New York',
    timezone: 'America/New_York'
  })

  const [inputValue, setInputValue] = useState(location.name)
  const [searching, setSearching] = useState(false)

  const { isError, isLoading, locations, fetchLocations } = useFetchLocations()
  const throttledFetch = throttle(fetchLocations, 100, { trailing: false })

  const resultsEl = useRef<HTMLUListElement>(null)

  function handleQuery (event: Event) {
    const inputEl = event.target as HTMLInputElement
    setInputValue(inputEl.value)
    throttledFetch(inputEl.value)
  }

  function handleFocus () {
    setInputValue('')
    setSearching(true)
    dispatch(hideForecast())
  }

  function handleBlur (event: FocusEvent) {
    // If blur is result of an interaction with any search results, then ignore.
    if (resultsEl.current != null && event.relatedTarget != null) {
      const target: Node | null =
        'nodeType' in event.relatedTarget ? event.relatedTarget : null
      if (resultsEl.current.contains(target)) {
        return
      }
    }
    // Otherwise, cancel searching.
    cancelSearching()
  }

  function handleOptionClick (id: string) {
    const location = locations?.find(item => item.id === id)
    if (location != null) {
      setLocation(location)
      onSelectLocation(location.latitude, location.longitude)
      cancelSearching()
    }
  }

  function cancelSearching () {
    setSearching(false)
    dispatch(showForecast())
  }

  const { name, state, latitude, longitude } = location

  return (
    <div class="my-8">
      <input
        value={searching ? inputValue : name}
        class="text-5xl w-full"
        onInput={handleQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <h3>
        {state}{' '}
        <span class="text-secondary dark:text-secondary">
          ({latitude}, {longitude})
        </span>
      </h3>

      {searching && locations && (
        <ul ref={resultsEl}>
          {locations.map(item => (
            <LocationOption
              key={item.id}
              id={item.id}
              name={item.name}
              state={item.state}
              latitude={item.latitude}
              longitude={item.longitude}
              onClick={handleOptionClick}
            />
          ))}
        </ul>
      )}
    </div>
  )
})

export { LocationInput as Location }
