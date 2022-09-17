import { configureStore } from '@reduxjs/toolkit'
import {
  forecastReducer,
  locationReducer,
  uiReducer
} from '../features'

import {
  api
} from '../services'

export const store = configureStore({
  reducer: {
    forecast: forecastReducer,
    location: locationReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
