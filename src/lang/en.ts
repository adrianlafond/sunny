import { WeatherCode } from '../constants'
import { Text } from './lang'

export const en: Text = {
  weather: {
    [WeatherCode.CLEAR]: 'Clear skies',
    [WeatherCode.MAINLY_CLEAR]: 'Mostly clear',
    [WeatherCode.PARTLY_CLOUDY]: 'Partly cloudy',
    [WeatherCode.OVERCAST]: 'Overcast',
    [WeatherCode.FOG]: 'Foggy',
    [WeatherCode.DEPOSITING_RIME_FOG]: 'Depositing rime fog',
    [WeatherCode.LIGHT_DRIZZLE]: 'Light drizzle',
    [WeatherCode.MODERATE_DRIZZLE]: 'Drizzle',
    [WeatherCode.DENSE_DRIZZLE]: 'Heavy drizzle',
    [WeatherCode.FREEZING_LIGHT_DRIZZLE]: 'Freezing drizzle',
    [WeatherCode.FREEZING_DENSE_DRIZZLE]: 'Freezing heavy drizzle',
    [WeatherCode.SLIGHT_RAIN]: 'Light rain',
    [WeatherCode.MODERATE_RAIN]: 'Rain',
    [WeatherCode.HEAVY_RAIN]: 'Heavy rain',
    [WeatherCode.FREEZING_LIGHT_RAIN]: 'Freezing rain',
    [WeatherCode.FREEZING_HEAVY_RAIN]: 'Heavy freezing rain',
    [WeatherCode.SLIGHT_SNOW]: 'Light snow',
    [WeatherCode.MODERSATE_SNOW]: 'Snow',
    [WeatherCode.HEAVY_SNOW]: 'Heavy snow',
    [WeatherCode.SNOW_GRAINS]: 'Snow grains',
    [WeatherCode.SLIGHT_RAIN_SHOWERS]: 'Light rain showers',
    [WeatherCode.MODERATE_RAIN_SHOWERS]: 'Rain showers',
    [WeatherCode.VIOLENT_RAIN_SHOWERS]: 'Heavy rain showers',
    [WeatherCode.SLIGHT_SNOW_SHOWERS]: 'Light snow showers',
    [WeatherCode.HEAVY_SNOW_SHOWERS]: 'Heavy snow showers',
    [WeatherCode.THUNDERSTORM]: 'Thunderstorm',
    [WeatherCode.THUNDERSTORM_WITH_SLIGHT_HAIL]: 'Thunderstorm with hail',
    [WeatherCode.THUNDERSTORM_WITH_HEAVY_HAIL]: 'Thunderstorm with heavy hail'
  }
}
