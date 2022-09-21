import { useCallback, useState } from 'preact/hooks'
import { fetchLocations as fetchLocationsService, Locations } from '../services'

export interface LocationsStatus {
  isError: boolean
  isLoading: boolean
  fetchLocations: (name: string) => void
  locations?: Locations
}

export function useFetchLocations () {
  const asyncFetchLocations = useCallback(async (name: string) => {
    const resp = await fetchLocationsService(name)
    setLocations({
      ...locations,
      isError: resp.error,
      isLoading: false,
      locations: resp.data
    })
  }, [])

  const fetchLocations = useCallback((name: string) => {
    setLocations({
      ...locations,
      isError: false,
      isLoading: true
    })
    asyncFetchLocations(name).catch(console.error)
  }, [])

  const [locations, setLocations] = useState<LocationsStatus>({
    isError: false,
    isLoading: false,
    fetchLocations
  })

  return locations
}
