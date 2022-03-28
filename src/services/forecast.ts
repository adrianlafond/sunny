import { WeatherCode } from './weather-code';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants';

const API = 'https://api.open-meteo.com/v1/forecast?'

export interface ForecastResponse {
  error: number | null;
  data?: Forecast;
}

export interface Forecast {
  latitude: number;
  longitude: number;
  elevation: number;
  utcOffsetSeconds: number;
  temperatureUnit: '°C' | '°F';
  hourly: {
    time: Date;
    temperature: number;
  }[];
  currentWeather: {
    time: Date;
    temperature: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: WeatherCode;
  },
  daily: {
    dawn: Date;
    dusk: Date;
    date: Date;
    weatherCode: WeatherCode;
  }[];
  timestamp: Date;
}

// Raw response from Open Meteo API
interface RawResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  utc_offset_seconds: number;
  hourly_units: {
    temperature_2m: '°C' | '°F';
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  current_weather: {
    time: string;
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: WeatherCode;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
    time: string[];
    weathercode: WeatherCode[];
  };
}

interface ForecastProps {
  latitude?: number;
  longitude?: number;
  hourly?: string[]; // can be more specific
  temperatureUnit?: 'C' | 'F';
  windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn';
  precipitationUnit?: 'mm' | 'inch';
  timezone?: string;
  currentWeather?: boolean;
}

/**
 * Fetches a forecast for a given latitude and longitude.
 */
export async function getForecast(props: ForecastProps = {}): Promise<ForecastResponse> {
  const latitude = props.latitude ?? DEFAULT_LATITUDE;
  const longitude = props.longitude ?? DEFAULT_LONGITUDE;
  const url = buildUrl({
    latitude,
    longitude,
    ...props,
  });
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const json = await response.json();
      return {
        error: null,
        data: convertJsonToData({
          ...json,
          latitude,
          longitude,
        }),
      }
    }
    return {
      error: response.status,
    };
  } catch (error) {
    return {
      error: 400,
    };
  }
}

function buildUrl({
  latitude = DEFAULT_LATITUDE,
  longitude = DEFAULT_LONGITUDE,
  hourly = ['temperature_2m'],
  temperatureUnit = 'C',
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timezone = 'America%2FNew_York',
  currentWeather = true,
}: ForecastProps = {}) {
  return [
    API,
    `latitude=${latitude}`,
    `&longitude=${longitude}`,
    `&hourly=${hourly}`,
    `&temperature_unit=${temperatureUnit === 'F' ? 'fahrenheit' : 'celsius'}`,
    `&windspeed_unit=${windSpeedUnit}`,
    `&precipitation_unit=${precipitationUnit}`,
    `&timezone=${timezone}`,
    `&current_weather=${currentWeather}`,
    `&daily=sunrise,sunset,weathercode`,
  ].join('');
}

// Converts raw API response to Forecast
function convertJsonToData(json: RawResponse): Forecast {
  return {
    latitude: json.latitude,
    longitude: json.longitude,
    elevation: json.elevation,
    utcOffsetSeconds: json.utc_offset_seconds,
    temperatureUnit: json.hourly_units.temperature_2m === '°F' ? '°F' : '°C',
    hourly: json.hourly.time.map((time, index) => ({
      time: new Date(time),
      temperature: +json.hourly.temperature_2m[index],
    })),
    currentWeather: {
      time: new Date(json.current_weather.time),
      temperature: json.current_weather.temperature,
      windSpeed: json.current_weather.windspeed,
      windDirection: json.current_weather.winddirection,
      weatherCode: json.current_weather.weathercode,
    },
    daily: json.daily.time.map((time, index) => ({
      dawn: new Date(json.daily.sunrise[index]),
      dusk: new Date(json.daily.sunset[index]),
      date: new Date(`${time}T12:00`),
      weatherCode: json.daily.weathercode[index],
    })),
    timestamp: new Date(),
  }
}