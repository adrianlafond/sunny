import { h } from 'preact'

export interface LocationOptionProps {
  name: string
  state: string
  latitude: number
  longitude: number
}

export const LocationOption = ({
  name,
  state,
  latitude,
  longitude
}: LocationOptionProps) => (
  <button class="block text-left text-xl border-t last-of-type:border-b border-solid border-slate-500 py-2 w-full">
    {name}
    <span class="text-sm ml-2">
      {state}{' '}
      <span class="text-secondary dark:text-secondary">
        ({latitude}, {longitude})
      </span>
    </span>
  </button>
)
