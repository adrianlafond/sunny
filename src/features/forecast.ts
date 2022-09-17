import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Forecast } from '../services'

const name = 'forecast'
const initialState: Forecast = {
  elevation: 0,
  utcOffsetSeconds: 0,
  temperatureUnit: 'C',
  hourly: [],
  currentWeather: {
    time: new Date().valueOf(),
    temperature: 0 / 0,
    windSpeed: 0,
    windDirection: 0,
    weatherCode: 0
  },
  daily: [],
  timestamp: new Date(0).valueOf()
}

export const forecastSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateForecast: (_state: Forecast, action: PayloadAction<Forecast>) => {
      return action.payload
    }
  }
})

export const { updateForecast } = forecastSlice.actions

export const forecastReducer = forecastSlice.reducer
