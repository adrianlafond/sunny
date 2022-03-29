import { Forecast } from './forecast';

/**
 * Returns a default forecast value so something can initially show.
 */
export function getDefaultForecast(): Forecast {
  return {
    name: 'Brooklyn',
    latitude: 40.6501,
    longitude: -73.94958,
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
