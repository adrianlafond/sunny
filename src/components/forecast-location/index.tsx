import { FunctionalComponent, h } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';
import { FORECAST_CACHE_TIME } from '../../constants';
import { Forecast, getForecast } from '../../services/forecast';
import { IconRight } from '../icons';

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
      // Forecast is stale. Fetch new data.
      const { name, latitude, longitude } = forecast;
      getForecast({
        name,
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

  const { temp, dawn, dusk, timestamp } = useMemo(() => ({
    temp: isNaN(forecast.currentWeather.temperature) ? '-' : forecast.currentWeather.temperature,
    dawn: forecast.daily[0]?.dawn ? new Date(forecast.daily[0].dawn).toLocaleTimeString() : '-',
    dusk: forecast.daily[0]?.dusk ? new Date(forecast.daily[0].dusk).toLocaleTimeString() : '-',
    timestamp: forecast.timestamp ? new Date(forecast.timestamp).toLocaleString() : '-',
  }), [forecast.timestamp]);

  return (
    <div class={classnames(page.page, style.location)}>
      <h2>{forecast.name}</h2>

      <p>{temp} {forecast.temperatureUnit}</p>
      <p>Dawn: {dawn}</p>
      <p>Dusk: {dusk}</p>

      <p>timestamp: {timestamp}</p>

      <p style={{ width: '24px', color: 'white' }}>
        <IconRight />
        {/* <svg style={{ width: '12px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
          <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
        </svg> */}
      </p>
    </div>
  );
};
