import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useMemo } from 'preact/hooks';
import classnames from 'classnames';
import { FORECAST_CACHE_TIME } from '../../constants';
import { Forecast, getForecast } from '../../services/forecast';
import page from '../shared/page.scss';
import style from './style.scss';
import { PreferencesContext } from '../../contexts';

interface ForecastLocationProps {
  forecast: Forecast;
  onForecastUpdate: (forecast: Forecast) => void;
  onForecastDelete: (forecast: Forecast) => void;
}

export const ForecastLocation: FunctionalComponent<ForecastLocationProps> = ({
  forecast,
  onForecastUpdate,
  onForecastDelete,
}) => {
  const preferencesContext = useContext(PreferencesContext);

  function updateForecast() {
    const { name, latitude, longitude } = forecast;
    getForecast({
      name,
      latitude,
      longitude,
      temperatureUnit: preferencesContext.preferences.temperatureUnit,
    }).then(response => {
      if (response.error) {
        //
      } else if (response.data) {
        onForecastUpdate(response.data);
      }
    });
  }

  useEffect(updateForecast, [preferencesContext.preferences]);

  useEffect(() => {
    if (Date.now() - forecast.timestamp.valueOf() >= FORECAST_CACHE_TIME) {
      updateForecast();
    }
  }, [forecast.timestamp]);

  const { temp, dawn, dusk, timestamp } = useMemo(() => ({
    temp: isNaN(forecast.currentWeather.temperature) ? '-' : forecast.currentWeather.temperature,
    dawn: forecast.daily[0]?.dawn ? new Date(forecast.daily[0].dawn).toLocaleTimeString() : '-',
    dusk: forecast.daily[0]?.dusk ? new Date(forecast.daily[0].dusk).toLocaleTimeString() : '-',
    timestamp: forecast.timestamp ? new Date(forecast.timestamp).toLocaleString() : '-',
  }), [forecast.timestamp]);

  function handleDelete() {
    onForecastDelete(forecast);
  }

  return (
    <div class={classnames(page.page, style.location)}>
      <h2>{forecast.name}</h2>

      <p>{temp} °{forecast.temperatureUnit}</p>
      <p>Dawn: {dawn}</p>
      <p>Dusk: {dusk}</p>

      <p>timestamp: {timestamp}</p>

      <button onClick={handleDelete}>Remove Forecast</button>
    </div>
  );
};
