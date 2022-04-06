import { Forecast } from './forecast';
import { Preferences } from '../contexts';

export function restoreForecasts() {
  if ('undefined' !== typeof window) {
    const storage = window.localStorage.getItem('forecasts');
    if (storage) {
      return JSON.parse(storage) as Forecast[];
    }
  }
  return null;
}

export function storeForecasts(forecasts: Forecast[]) {
  if ('undefined' !== typeof window) {
    window.localStorage.setItem('forecasts', JSON.stringify(forecasts));
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
