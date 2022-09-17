import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Location } from '../services'
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants'

const name = 'location'
const initialState: Location = {
  id: 'default',
  name: 'Brooklyn',
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  country: 'United States',
  state: 'New York',
  timezone: 'America/New_York'
}

export const locationSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateLocation: (_state: Location, action: PayloadAction<Location>) => {
      return action.payload
    }
  }
})

export const { updateLocation } = locationSlice.actions

export const locationReducer = locationSlice.reducer
