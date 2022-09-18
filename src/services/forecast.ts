import { WeatherCode, DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants'

const API = 'https://api.open-meteo.com/v1/forecast?'

export interface ForecastResponse {
  error: number | null
  data?: Forecast
}

export interface Forecast {
  elevation: number
  utcOffsetSeconds: number
  temperatureUnit: 'C' | 'F'
  hourly: HourlyForecast[]
  currentWeather: {
    time: number
    temperature: number
    windSpeed: number
    windDirection: number
    weatherCode: WeatherCode
  }
  daily: DailyForecast[]
  timestamp: number
}

export interface HourlyForecast {
  time: number
  temperature: number
  apparentTemperature: number
  precipitation: number
  snowDepth: number
  weatherCode: WeatherCode
}

export interface DailyForecast {
  dawn: number
  dusk: number
  date: number
  weatherCode: WeatherCode
}

// Raw response from Open-Meteo API
export interface RawForecastResponse {
  latitude: number
  longitude: number
  elevation: number
  utc_offset_seconds: number
  hourly_units: {
    temperature_2m: '°C' | '°F'
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    precipitation: number[]
    snow_depth: number[]
    weathercode: number[]
  }
  current_weather: {
    time: string
    temperature: number
    windspeed: number
    winddirection: number
    weathercode: WeatherCode
  }
  daily: {
    sunrise: string[]
    sunset: string[]
    time: string[]
    weathercode: WeatherCode[]
  }
}

export interface ForecastProps {
  latitude?: number
  longitude?: number
  hourly?: string[] // can be more specific
  temperatureUnit?: 'C' | 'F'
  windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn'
  precipitationUnit?: 'mm' | 'inch'
  timezone?: string
  currentWeather?: boolean
}

/**
 * Fetches a forecast for a given latitude and longitude.
 */
export async function getForecast (props: ForecastProps = {}): Promise<ForecastResponse> {
  const latitude = props.latitude ?? DEFAULT_LATITUDE
  const longitude = props.longitude ?? DEFAULT_LONGITUDE
  const url = buildUrl({
    ...props,
    latitude,
    longitude
  })
  try {
    const response = await fetch(url)
    if (response.status === 200) {
      const json = await response.json()
      return {
        error: null,
        data: convertForecastJsonToData({
          ...json,
          latitude,
          longitude
        })
      }
    }
    return {
      error: response.status
    }
  } catch (error) {
    return {
      error: 400
    }
  }
}

function buildUrl ({
  latitude = DEFAULT_LATITUDE,
  longitude = DEFAULT_LONGITUDE,
  hourly = ['temperature_2m', 'apparent_temperature', 'precipitation', 'snow_depth', 'weathercode'],
  temperatureUnit = 'F',
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timezone = 'America%2FNew_York',
  currentWeather = true
}: Omit<ForecastProps, 'name'> = {}) {
  return [
    API,
    `latitude=${latitude}`,
    `&longitude=${longitude}`,
    `&hourly=${hourly.toString()}`,
    `&temperature_unit=${temperatureUnit === 'F' ? 'fahrenheit' : 'celsius'}`,
    `&windspeed_unit=${windSpeedUnit}`,
    `&precipitation_unit=${precipitationUnit}`,
    `&timezone=${timezone}`,
    `&current_weather=${currentWeather.toString()}`,
    '&daily=sunrise,sunset,weathercode'
  ].join('')
}

// Converts raw API response to Forecast
export function convertForecastJsonToData (json: RawForecastResponse): Forecast {
  return {
    elevation: json.elevation,
    utcOffsetSeconds: json.utc_offset_seconds,
    temperatureUnit: json.hourly_units.temperature_2m === '°F' ? 'F' : 'C',
    hourly: json.hourly.time.map((time, index) => ({
      time: new Date(time).valueOf(),
      temperature: +json.hourly.temperature_2m[index],
      apparentTemperature: +json.hourly.apparent_temperature[index],
      precipitation: +json.hourly.precipitation[index],
      snowDepth: +json.hourly.snow_depth[index],
      weatherCode: +json.hourly.weathercode[index]
    })),
    currentWeather: {
      time: new Date(json.current_weather.time).valueOf(),
      temperature: json.current_weather.temperature,
      windSpeed: json.current_weather.windspeed,
      windDirection: json.current_weather.winddirection,
      weatherCode: json.current_weather.weathercode
    },
    daily: json.daily.time.map((time, index) => ({
      dawn: new Date(json.daily.sunrise[index]).valueOf(),
      dusk: new Date(json.daily.sunset[index]).valueOf(),
      date: new Date(`${time}T12:00`).valueOf(),
      weatherCode: json.daily.weathercode[index]
    })),
    timestamp: new Date().valueOf()
  }
}
