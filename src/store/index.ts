import { configureStore } from '@reduxjs/toolkit';
import {
  forecastsReducer,
  // locationsReducer,
  navigationReducer,
  preferencesReducer,
  zoomReducer,
} from '../features';

import {
  locationsApi
} from '../services';

export const store = configureStore({
  reducer: {
    forecasts: forecastsReducer,
    // locations: locationsReducer,
    navigation: navigationReducer,
    preferences: preferencesReducer,
    zoom: zoomReducer,

    // This resulted in an error: "Uncaught (in promise) TypeError: u is null"
    [locationsApi.reducerPath]: locationsApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(locationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
