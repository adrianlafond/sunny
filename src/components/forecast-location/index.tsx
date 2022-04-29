import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import classnames from 'classnames';
import { FORECAST_CACHE_TIME } from '../../constants';
import { Forecast, getForecast } from '../../services/forecast';
import page from '../shared/page.scss';
import typography from '../shared/typography.scss';
import style from './style.scss';
import { PreferencesContext } from '../../contexts';
import { WeatherCode } from '../../services';

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

  const [hourIndex, setHourIndex] = useState({
    value: 0,
    time: 0,
  });

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

  const { dawn, dusk, timestamp } = useMemo(() => ({
    dawn: forecast.daily[0]?.dawn ? new Date(forecast.daily[0].dawn).toLocaleTimeString() : '-',
    dusk: forecast.daily[0]?.dusk ? new Date(forecast.daily[0].dusk).toLocaleTimeString() : '-',
    timestamp: forecast.timestamp ? new Date(forecast.timestamp).toLocaleString() : '-',
  }), [forecast.timestamp]);

  useEffect(() => {
    const now = hourIndex.time || Date.now();
    let index = 0;
    forecast.hourly.some((hour, i) => {
      if (hour.time > now) {
        return true;
      }
      index  = i;
    });
    setHourIndex({
      value: index,
      time: forecast.hourly[index].time,
    });
  }, [forecast.timestamp]);

  function handleDown(event: Event) {
    event.stopPropagation();
  }

  function handleHourChange(event: Event) {
    const el = event.target as HTMLInputElement;
    setHourIndex({
      value: +el.value,
      time: forecast.hourly[+el.value].time,
    });
  }

  function logData() {
    console.log(forecast);
  }

  function handleDelete() {
    onForecastDelete(forecast);
  }

  const hour = forecast.hourly[hourIndex.value];
  const code = 0; // hour.weatherCode

  return (
    <div class={classnames(page.page, style.location, style[`location--code-${code}`])}>
      <div class={page.page__content}>
        <h2 class={typography.h3}>{forecast.name}</h2>

        <h3 class={typography.h2}>
          {hour?.temperature || '-'}

          <span class={style['location__temp-small']}>°{forecast.temperatureUnit}</span>
        </h3>

        <p>Feels like: {hour?.apparentTemperature || '-'} °{forecast.temperatureUnit}</p>

        <p>{hour ? WeatherCode[hour.weatherCode] : '-'}</p>

        <p>{hour ? new Date(hour.time).toLocaleString() : '-'}</p>

        <input
          type="range"
          min={0}
          max={forecast.hourly.length - 1}
          class={style['location__hour-slider']}
          onMouseDown={handleDown}
          onInput={handleHourChange}
          value={hourIndex.value}
        />

        <hr />

        <p>Dawn: {dawn}</p>
        <p>Dusk: {dusk}</p>

        <p>Fetched from API: {timestamp}</p>

        <p>
          <button onClick={logData}>Log Forecast</button>
        </p>

        <p>
          <button onClick={handleDelete}>Remove Forecast</button>
        </p>
      </div>
    </div>
  );
};
