import { Fragment, h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
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
  const [focusIndex, setFocusIndex] = useState(-1)

  // TODO: isError, isLoading,
  const { locations, fetchLocations } = useFetchLocations()
  const throttledFetch = throttle(fetchLocations, 100, { trailing: false })

  const inputEl = useRef<HTMLInputElement>(null)
  const resultsEl = useRef<HTMLUListElement>(null)

  function handleQuery (event: Event) {
    const inputEl = event.target as HTMLInputElement
    setInputValue(inputEl.value)
    throttledFetch(inputEl.value)
  }

  function handleFocus () {
    setFocusIndex(-1)
    setSearching(true)
    onSearchStart()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (inputEl.current != null) {
            event.preventDefault()
            if (focusIndex === -1) {
              inputEl.current.blur()
            } else {
              cancelSearching()
            }
          }
          break
        case 'ArrowDown': {
          event.preventDefault()
          const maxFocusIndex = locations != null ? locations.length - 1 : -1
          setFocusIndex(Math.min(maxFocusIndex, focusIndex + 1))
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          const minFocusIndex = -1
          setFocusIndex(Math.max(minFocusIndex, focusIndex - 1))
          break
        }
        default:
          break
      }
    }
    if (searching) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searching, focusIndex, locations])

  useEffect(() => {
    if (searching && focusIndex === -1 && inputEl.current != null) {
      inputEl.current.focus()
    }
  }, [focusIndex])

  function handleBlur (event: FocusEvent) {
    // If blur is result of an interaction with any search results, then ignore.
    if (resultsEl.current != null) {
      if (event.relatedTarget != null) {
        const target: Node | null =
          'nodeType' in event.relatedTarget ? event.relatedTarget : null
        if (!resultsEl.current.contains(target)) {
          cancelSearching()
        }
      } else {
        // f*cking Safari: event.relatedTarget is `null`!
        setTimeout(() => {
          if (searching) {
            cancelSearching()
          }
        }, 100)
      }
    } else {
      cancelSearching()
    }
  }

  function handleOptionClick (id: string) {
    const location = locations?.find(item => item.id === id)
    if (location != null) {
      save(location)
      setInputValue(location.name)
      setLocation(location)
      onSelectLocation(location.latitude, location.longitude)
      cancelSearching()
    }
  }

  function cancelSearching () {
    setSearching(false)
    setFocusIndex(-1)
    onSearchEnd()
  }

  const { name, state, latitude, longitude } = location

  return (
    <Fragment>
      <input
        value={searching ? inputValue : name}
        class="appearance-none text-4xl w-full bg-transparent hover:bg-slate-100 focus:bg-white rounded-none border-0"
        type="search"
        onInput={handleQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputEl}
      />

      {searching && locations && (
        <ul ref={resultsEl} class="bg-light z-10 w-full mb-8">
          {locations.map((item, index) => (
            <LocationOption
              key={item.id}
              id={item.id}
              focus={focusIndex === index}
              name={item.name}
              state={item.state}
              latitude={item.latitude}
              longitude={item.longitude}
              onClick={handleOptionClick}
            />
          ))}
        </ul>
      )}

      <h3>
        {state}{' '}
        <span class="text-secondary dark:text-secondary">
          ({latitude}, {longitude})
        </span>
      </h3>
    </Fragment>
  )
})

export { LocationInput as Location }
