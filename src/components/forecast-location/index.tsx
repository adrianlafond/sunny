import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';
import { FORECAST_CACHE_TIME } from '../../constants';
import { Forecast, getForecast } from '../../services/forecast';

interface ForecastLocationProps {
  forecast: Forecast;
  onForecastUpdate: (forecast: Forecast) => void;
}

export const ForecastLocation: FunctionalComponent<ForecastLocationProps> = ({
  forecast,
  onForecastUpdate,
}) => {
  useEffect(() => {
    if (Date.now() - forecast.timestamp.valueOf() >= FORECAST_CACHE_TIME) {
      const { latitude, longitude } = forecast;
      getForecast({
        latitude,
        longitude,
      }).then(response => {
        if (response.error) {
          //
        } else if (response.data) {
          onForecastUpdate(response.data);
        }
      });
    }
  }, [forecast.timestamp]);

  const temp = isNaN(forecast.currentWeather.temperature) ? '-' : forecast.currentWeather.temperature;

  return (
    <div class={classnames(page.page, style.location)}>
      <h2>Forecast Location</h2>

      <p>{temp} {forecast.temperatureUnit}</p>
      <p>Dawn: {forecast.daily[0]?.dawn.toLocaleTimeString()}</p>
      <p>Dusk: {forecast.daily[0]?.dusk.toLocaleTimeString()}</p>
    </div>
  );
};
