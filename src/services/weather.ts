
const NEW_YORK = 'https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&hourly=temperature_2m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&current_weather=true'

interface ForecastResponse {
  error: number | null;
  data?: Forecast;
}

interface Forecast {
  latitude: number;
  longitude: number;
  elevation: number;
  utcOffsetSeconds: number;
  unit: '°C' | '°F';
  hourly: {
    time: Date;
    temperature: number;
  }[];
  currentWeather: {
    time: Date;
    temperature: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
  }
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
    weathercode: number;
  }
}

/**
 * Fetches a forecast for a given latitude and longitude.
 */
export async function getForecast(url = NEW_YORK): Promise<ForecastResponse> {
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const json = await response.json();
      return {
        error: null,
        data: convertJsonToData(json),
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

// Converts raw API response to Forecast
function convertJsonToData(json: RawResponse): Forecast {
  return {
    latitude: json.latitude,
    longitude: json.longitude,
    elevation: json.elevation,
    utcOffsetSeconds: json.utc_offset_seconds,
    unit: json.hourly_units.temperature_2m === '°F' ? '°F' : '°C',
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
    }
  }
}