import { WeatherCode } from '../constants'

export interface Text {
  weather: { [key in WeatherCode]: string; }
}
