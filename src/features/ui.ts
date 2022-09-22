import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'day' | 'night'
export interface Ui {
  /**
   * Day/night themes correspond to light/dark.
   */
  theme: Theme

  /**
   * Forecast is hidden while locations are being searched.
   */
  hideForecast: boolean
}

const name = 'ui'
const initialState: Ui = {
  theme: 'day',
  hideForecast: false
}

export const uiSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateTheme: (state: Ui, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    showForecast: (state: Ui) => {
      state.hideForecast = false
    },
    hideForecast: (state: Ui) => {
      state.hideForecast = true
    }
  }
})

export const { updateTheme, showForecast, hideForecast } = uiSlice.actions

export const uiReducer = uiSlice.reducer
