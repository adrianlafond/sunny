import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { route } from 'preact-router';
import { encodeForecastPath, restoreForecasts } from '../services';
import { Forecast } from '../services';

export interface ForecastState extends Forecast {
  error: number | null;
  loading: boolean;
}

const name = 'forecasts';

const initialState = restoreForecasts() as ForecastState[];

function getForecastIndex(forecasts: Forecast[], forecast: Forecast) {
  return forecasts.findIndex(f => (
    f.latitude === forecast.latitude && f.longitude === forecast.longitude
  ));
}

export const forecastsSlice = createSlice({
  name,
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Forecast>) => {
      const index = getForecastIndex(state, action.payload);
      const forecast: ForecastState = {
        ...action.payload,
        error: null,
        loading: false,
      };
      if (index === -1) {
        state.push(forecast);
      } else {
        state[index] = forecast;
      }
    },
    remove: (state, action: PayloadAction<ForecastState>) => {
      const index = getForecastIndex(state, action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

const { update, remove } = forecastsSlice.actions;

/**
 * Updates (via replacing) a forecast.
 */
export const updateForecast = (dispatch: Dispatch, forecast: Forecast) => {
  dispatch(update(forecast));
};

/**
 * Adds a new forecast then routes to it.
 */
export const addForecast = (dispatch: Dispatch, forecast: Forecast) => {
  dispatch(update(forecast));
  route(encodeForecastPath(forecast));
};

/**
 * Removes a forecast then routes to "/".
 */
export const removeForecast = (dispatch: Dispatch, forecast: ForecastState) => {
  dispatch(remove(forecast));
  route('/');
};

export const forecastsReducer = forecastsSlice.reducer;