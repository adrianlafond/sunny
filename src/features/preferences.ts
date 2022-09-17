import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { restorePreferences } from '../services'

export interface Preferences {
  temperatureUnit: 'C' | 'F'
}

const name = 'preferences'
const initialState = (restorePreferences() || {
  temperatureUnit: 'F'
}) as Preferences

export const preferencesSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateTemperatureUnit: (state: Preferences, action: PayloadAction<Preferences['temperatureUnit']>) => {
      state.temperatureUnit = action.payload
    }
  }
})

export const { updateTemperatureUnit } = preferencesSlice.actions

export const preferencesReducer = preferencesSlice.reducer
