import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { AddLocation } from '../add-location';
import { Preferences } from '../preferences';
import { WeatherLocation } from '../weather-location';
import style from './style.scss';
import { Forecast } from '../../services/forecast';

export const SpatialNavigation: FunctionalComponent = () => {
  // TODO: move all forecasts code to a Forecasts component
  const [forecasts, setForecasts] = useState<Forecast[]>([{
    latitude: 40.6501,
    longitude: -73.94958,
    elevation: 0,
    utcOffsetSeconds: 0,
    temperatureUnit: '°C',
    hourly: [],
    currentWeather: {
      time: new Date(),
      temperature: 0 / 0,
      windSpeed: 0,
      windDirection: 0,
      weatherCode: 0,
    },
    daily: [],
    timestamp: new Date(0),
  }]);

  function addForecast(forecast: Forecast) {
    const index = forecasts.findIndex(f => (
      f.latitude === forecast.latitude && f.longitude === forecast.longitude
    ));
    const newForecasts = forecasts.slice();
    if (index === -1) {
      newForecasts.push(forecast);
    } else {
      newForecasts[index] = forecast;
    }
    setForecasts(newForecasts);
  }

  return (
    <div class={style.spatialnav}>
      <div class={style.spatialnav__zoom}>
        <div class={style.spatialnav__locations}>
          {forecasts.map(forecast => (
            <WeatherLocation
              key={`${forecast.latitude},${forecast.longitude}`}
              forecast={forecast}
              onForecastUpdate={addForecast}
            />
          ))}
          <AddLocation />
        </div>
        <Preferences />
      </div>
    </div>
  );
};
