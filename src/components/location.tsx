import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import throttle from 'lodash.throttle'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useLazyGetLocationCoordsQuery } from '../services'
import { RootState } from '../store'
import { LocationOption } from './location-option'
import { updateLocation, hideForecast, showForecast } from '../features'

export const Location = () => {
  const dispatch = useAppDispatch()
  const { name, state, latitude, longitude } = useAppSelector((state: RootState) => state.location)

  const [inputValue, setInputValue] = useState(name)
  const [searching, setSearching] = useState(false)

  const [trigger, result] = useLazyGetLocationCoordsQuery()
  const throttledTrigger = throttle(trigger, 100, { trailing: false })

  const resultsEl = useRef<HTMLUListElement>(null)

  function handleQuery (event: Event) {
    const inputEl = event.target as HTMLInputElement
    setInputValue(inputEl.value)
    throttledTrigger(inputEl.value)?.catch(console.error)
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
    const location = result.currentData?.find(item => item.id === id)
    if (location != null) {
      dispatch(updateLocation(location))
      cancelSearching()
    }
  }

  function cancelSearching () {
    setSearching(false)
    dispatch(showForecast())
  }

  useEffect(throttledTrigger.cancel)

  return (
    <div class="my-8">
      <input
        value={searching ? inputValue : name}
        class="text-5xl w-full"
        onInput={handleQuery}
        onFocus={handleFocus}
        onBlurCapture={handleBlur}
      />
      <h3>
        {state}{' '}
        <span class="text-secondary dark:text-secondary">
          ({latitude}, {longitude})
        </span>
      </h3>

      {searching && result.currentData && (
        <ul ref={resultsEl}>
          {result.currentData?.map(item => (
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
}
