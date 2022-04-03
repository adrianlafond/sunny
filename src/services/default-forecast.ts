import { Forecast } from './forecast';

/**
 * Creates a data object with placeholder values for a new forecast.
 */
export function createStubForecast(name: string, latitude: number, longitude: number): Forecast {
  return {
    name,
    latitude,
    longitude,
    elevation: 0,
    utcOffsetSeconds: 0,
    temperatureUnit: '°C',
    hourly: [],
    currentWeather: {
      time: new Date().valueOf(),
      temperature: 0 / 0,
      windSpeed: 0,
      windDirection: 0,
      weatherCode: 0,
    },
    daily: [],
    timestamp: new Date(0).valueOf(),
  };
}

/**
 * Returns a default forecast value so something can initially show.
 */
export function getDefaultForecast(): Forecast {
  return createStubForecast('Brooklyn', 40.6501, -73.94958);
}
