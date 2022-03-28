import { createContext } from 'preact';
import { Forecast } from '../services/forecast';

export const ForecastContext = createContext<Forecast[]>([{
  latitude: 40.6501,
  longitude: -73.94958,
  elevation: 0,
  utcOffsetSeconds: 0,
  temperatureUnit: '°C',
  hourly: [],
  currentWeather: {
    time: new Date(),
    temperature: 0/0,
    windSpeed: 0,
    windDirection: 0,
    weatherCode: 0,
  },
  daily: [],
  timestamp: new Date(0),
}]);
