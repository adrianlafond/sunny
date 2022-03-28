import { WeatherCode } from '../services/weather-code';

export interface Text {
  weather: { [key in WeatherCode]: string; };
}
