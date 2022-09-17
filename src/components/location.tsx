import { h } from 'preact'
import throttle from 'lodash.throttle'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useLazyGetLocationCoordsQuery } from '../services'
import { RootState } from '../store'
import { useEffect } from 'preact/hooks'
import { LocationOption } from './location-option'
import { hideForecast, showForecast } from '../features'

export const Location = () => {
  const dispatch = useAppDispatch()
  const { name, state, latitude, longitude } = useAppSelector((state: RootState) => state.location)

  const [trigger, result] = useLazyGetLocationCoordsQuery()
  const throttledTrigger = throttle(trigger, 100, { trailing: false })

  console.log('Location.render()')
  console.log(result)

  function handleQuery (event: Event) {
    const inputEl = event.target as HTMLInputElement
    throttledTrigger(inputEl.value)?.catch(console.error)
  }

  function handleFocus () {
    dispatch(hideForecast())
  }

  function handleBlur () {
    dispatch(showForecast())
  }

  useEffect(throttledTrigger.cancel)

  return (
    <div class="my-8">
      <input class="text-5xl w-full" onInput={handleQuery} onFocus={handleFocus} onBlur={handleBlur} />
      <h3>
        {state}{' '}
        <span class="text-secondary dark:text-secondary">
          ({latitude}, {longitude})
        </span>
      </h3>

      <LocationOption
        key="test"
        name="White Plains"
        state="New York"
        latitude={40.6501}
        longitude={-73.94958}
      />
      <LocationOption
        key="test-2"
        name="White Plains White Plains White Plains White Plains White Plains White Plains"
        state="New York"
        latitude={40.6501}
        longitude={-73.94958}
      />

      {result.currentData?.map(item => (
        <LocationOption
          key={item.id}
          name={item.name}
          state={item.state}
          latitude={item.latitude}
          longitude={item.longitude}
        />
      ))}
    </div>
  )
}
