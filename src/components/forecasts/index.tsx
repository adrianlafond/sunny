import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { AddLocation } from '../add-location';
import { ForecastLocation } from '../forecast-location';
import { Forecast } from '../../services/forecast';
import { restoreForecasts, storeForecasts } from '../../services/storage';
import { getDefaultForecast } from '../../services/default-forecast';
import style from './style.scss';

export const Forecasts: FunctionalComponent = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>(restoreForecasts() || [getDefaultForecast()]);

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
