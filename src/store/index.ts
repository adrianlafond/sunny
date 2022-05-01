import { configureStore } from '@reduxjs/toolkit';
import {
  forecastsReducer,
  locationsReducer,
  preferencesReducer,
  zoomReducer,
} from '../features';

export const store = configureStore({
  reducer: {
    forecasts: forecastsReducer,
    locations: locationsReducer,
    preferences: preferencesReducer,
    zoom: zoomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
