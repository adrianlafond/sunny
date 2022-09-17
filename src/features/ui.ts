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
  showForecast: boolean
}

const name = 'ui'
const initialState: Ui = {
  theme: 'day',
  showForecast: true
}

export const uiSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateTheme: (state: Ui, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    showForecast: (state: Ui) => {
      state.showForecast = true
    },
    hideForecast: (state: Ui) => {
      state.showForecast = false
    }
  }
})

export const { updateTheme, showForecast, hideForecast } = uiSlice.actions

export const uiReducer = uiSlice.reducer
