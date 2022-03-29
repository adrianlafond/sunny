import { Forecast } from './forecast';

export function restoreForecasts() {
  if ('undefined' !== typeof window) {
    const storage = window.localStorage.getItem('sunny');
    if (storage) {
      return JSON.parse(storage) as Forecast[];
    }
  }
  return null;
}

export function storeForecasts(forecasts: Forecast[]) {
  if ('undefined' !== typeof window) {
    window.localStorage.setItem('sunny', JSON.stringify(forecasts));
  }
}
