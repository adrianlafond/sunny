import { Forecast } from './forecast';

/**
 * Returns a URL path for the foreface using latitude and longitude.
 */
export function encodeForecastPath(forecast: Forecast) {
  // "." breaks deep-linking so replace with "x":
  return `/forecast/${forecast.latitude},${forecast.longitude}`.replace(/\./g, 'x');
}

/**
 * Returns latitude and longitude from a forecast URL path.
 */
export function decodeForecastPath(path: string) {
  if (path.startsWith('/forecast/add')) {
    return null;
  }
  const match = path.match(/^\/forecast\/(.*)$/);
  if (match) {
    const query = match[1].replace(/x/g, '.');
    const coords = query.split(',');
    return {
      latitude: +coords[0],
      longitude: +coords[1],
    };
  }
  return null;
}