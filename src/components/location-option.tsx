import { h } from 'preact'

export interface LocationOptionProps {
  id: string
  name: string
  state: string
  latitude: number
  longitude: number
  onClick: (id: string) => void
}

export const LocationOption = ({
  id,
  name,
  state,
  latitude,
  longitude,
  onClick
}: LocationOptionProps) => (
  <li class="border-t last-of-type:border-b border-solid border-slate-500">
    <button
      onClick={() => onClick(id)}
      class="block text-left text-xl py-2 w-full"
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
