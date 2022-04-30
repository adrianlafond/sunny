import { configureStore } from '@reduxjs/toolkit';
import {
  forecastsReducer,
  locationsReducer,
  preferencesReducer,
} from '../features';

export const store = configureStore({
  reducer: {
    forecasts: forecastsReducer,
    locations: locationsReducer,
    preferences: preferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
