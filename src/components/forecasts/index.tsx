import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { IconLeft, IconRight } from '../icons';
import { AddLocation } from '../add-location';
import { ForecastLocation } from '../forecast-location';
import { Forecast } from '../../services/forecast';
import { restoreForecasts, storeForecasts } from '../../services/storage';
import { getDefaultForecast } from '../../services/default-forecast';
import { NavigationContext } from '../../contexts';
import style from './style.scss';
import { decodeForecastPath, encodeForecastPath } from '../../services/paths';

export const Forecasts: FunctionalComponent = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>(restoreForecasts() || [getDefaultForecast()]);

  const carousel = useRef<HTMLDivElement>(null);

  const navigation = useContext(NavigationContext);

  function isAddPage() {
    return navigation.path.startsWith('/forecast/add');
  }

  function isForecastPage() {
    return navigation.path.startsWith('/forecast');
  }

  function getForecastIndex() {
    if (navigation.path === '/') {
      return 0;
    }
    if (isAddPage()) {
      return forecasts.length - 1;
    }
    if (navigation.path.startsWith('/forecast')) {
      const coords = decodeForecastPath(navigation.path);
      if (coords) {
        const { latitude, longitude } = coords;
        return forecasts.findIndex(f => f.latitude === latitude && f.longitude === longitude);
      }
    }
    return -1;
  };

  // On navigation path change, slides the relevant forecast into view.
  useEffect(() => {
    if (!carousel.current) {
      return;
    }
    if (isAddPage()) {
      carousel.current.style.transform = `translateX(-${forecasts.length * window.innerWidth}px)`;
    } else {
      const index = getForecastIndex();
      if (isForecastPage() && index === -1) {
        route('/forecast/add');
      } else {
        carousel.current.style.transform = `translateX(-${index * window.innerWidth}px)`;
      }
    }
  }, [navigation.path]);

  // Adds or updates the forecast to the forecasts array.
  function updateForecast(forecast: Forecast) {
    const index = forecasts.findIndex(f => (
      f.latitude === forecast.latitude && f.longitude === forecast.longitude
    ));
    const newForecasts = forecasts.slice();
    if (index === -1) {
      newForecasts.push(forecast);
    } else {
      newForecasts[index] = forecast;
    }
    storeForecasts(newForecasts);
    setForecasts(newForecasts);
  }

  // Adds the forecast then routes to it.
  function addForecast(forecast: Forecast) {
    updateForecast(forecast);
    route(encodeForecastPath(forecast));
  }

  const handleLeftClick = () => {
    route(encodeForecastPath(forecasts[0]));
  }

  const handleRightClick = () => {
    route(`/forecast/add`);
  };

  const handlePrefsClick = () => {
    route(`/preferences`);
  }

  return (
    <div class={style.forecasts}>
      <div class={style.forecasts__carousel} ref={carousel}>
        {forecasts.map(forecast => (
          <ForecastLocation
            key={`${forecast.latitude},${forecast.longitude}`}
            forecast={forecast}
            onForecastUpdate={updateForecast}
          />
        ))}
        <AddLocation onAddForecast={addForecast} />
      </div>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--left'])}
        aria-label="previous"
        onClick={handleLeftClick}
      >
        <IconLeft />
      </button>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--right'])}
        aria-label="next"
        onClick={handleRightClick}
      >
        <IconRight />
      </button>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--prefs'])}
        aria-label="preferences"
        onClick={handlePrefsClick}
      >
        Prefs
      </button>
    </div>
  );
};
