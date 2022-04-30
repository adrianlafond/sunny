import { ForecastState, Preferences } from '../features';
import { getDefaultForecast } from './default-forecast';

export function restoreForecasts() {
  if ('undefined' !== typeof window) {
    const storage = window.localStorage.getItem('forecasts');
    if (storage) {
      return JSON.parse(storage) as ForecastState[];
    }
  }
  return [getDefaultForecast()];
}

export function storeForecasts(forecasts: ForecastState[]) {
  if ('undefined' !== typeof window) {
    const store = forecasts.map(f => ({
      ...f,
      error: null,
      loading: false,
    }));
    window.localStorage.setItem('forecasts', JSON.stringify(store));
  }
}

export function restorePreferences() {
  if ('undefined' !== typeof window) {
    const storage = window.localStorage.getItem('preferences');
    if (storage) {
      return JSON.parse(storage) as Preferences;
    }
  }
  return null;
}

export function storePreferences(preferences: Preferences) {
  if ('undefined' !== typeof window) {
    window.localStorage.setItem('preferences', JSON.stringify(preferences));
  }
}
