import { h } from 'preact'
import { useRef, useState } from 'preact/hooks'
import { memo } from 'preact/compat'
import throttle from 'lodash.throttle'
import { useFetchLocations } from '../hooks'
import { LocationOption } from './location-option'
import { Location, restoreLocation, save } from '../services'

export interface LocationProps {
  onSearchStart: () => void
  onSearchEnd: () => void
  onSelectLocation: (latitude: number, longitude: number) => void
}

const LocationInput = memo(({
  onSearchStart,
  onSearchEnd,
  onSelectLocation
}: LocationProps) => {
  const [location, setLocation] = useState<Location>(restoreLocation())

  const [inputValue, setInputValue] = useState(location.name)
  const [searching, setSearching] = useState(false)

  // TODO: isError, isLoading,
  const { locations, fetchLocations } = useFetchLocations()
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
    onSearchStart()
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
      save(location)
      setLocation(location)
      onSelectLocation(location.latitude, location.longitude)
      cancelSearching()
    }
  }

  function cancelSearching () {
    setSearching(false)
    onSearchEnd()
  }

  const { name, state, latitude, longitude } = location

  return (
    <div class="my-8 relative">
      <input
        value={searching ? inputValue : name}
        class="text-5xl w-full"
        onInput={handleQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {!searching && (
        <h3>
          {state}{' '}
          <span class="text-secondary dark:text-secondary">
            ({latitude}, {longitude})
          </span>
        </h3>
      )}

      {searching && locations && (
        <ul ref={resultsEl} class="absolute left-0 top-12 bg-light z-10 w-full">
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
