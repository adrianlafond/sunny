import { h } from 'preact'
import { memo, useEffect, useRef } from 'preact/compat'

export interface LocationOptionProps {
  id: string
  focus?: boolean
  name: string
  state: string
  latitude: number
  longitude: number
  onClick: (id: string) => void
}

const LocationOptionComponent = ({
  id,
  focus,
  name,
  state,
  latitude,
  longitude,
  onClick
}: LocationOptionProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (focus === true && buttonRef.current != null) {
      buttonRef.current.focus()
    }
  }, [focus])

  return (
    <li class="border-t last-of-type:border-b border-solid border-slate-500">
      <button
        autoFocus={focus}
        onClick={() => onClick(id)}
        class="block text-left text-xl py-2 w-full focus:bg-slate-100 hover:bg-slate-100"
        ref={buttonRef}
      >
        {name}
        <span class="text-sm ml-2">
          {state}{' '}
          <span class="text-secondary dark:text-secondary">
            ({latitude}, {longitude})
          </span>
        </span>
      </button>
    </li>
  )
}

export const LocationOption = memo(LocationOptionComponent)
