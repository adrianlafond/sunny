import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { AddLocation } from '../add-location';
import { ForecastLocation } from '../forecast-location';
import { Forecast } from '../../services/forecast';
import { restoreForecasts, storeForecasts } from '../../services/storage';
import style from './style.scss';

export const Forecasts: FunctionalComponent = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>(restoreForecasts() || [{
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
    console.log(newForecasts);
    storeForecasts(newForecasts);
    setForecasts(newForecasts);
  }

  return (
    <div class={style.forecasts}>
      {forecasts.map(forecast => (
        <ForecastLocation
          key={`${forecast.latitude},${forecast.longitude}`}
          forecast={forecast}
          onForecastUpdate={addForecast}
        />
      ))}
      <AddLocation />
    </div>
  );
};
