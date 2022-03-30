import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
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

export const Forecasts: FunctionalComponent = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>(restoreForecasts() || [getDefaultForecast()]);

  const carousel = useRef<HTMLDivElement>(null);

  const navigation = useContext(NavigationContext);

  useEffect(() => {
    // On navigation path change, slide the relevant forecast into view.
    if (!carousel.current) {
      return;
    }
    const el = carousel.current;
    const match = navigation.path.match(/^\/forecast\/(.*)$/);
    if (match) {
      const query = match[1].replace(/x/g, '.');
      const coords = query.split(',');
      const index = forecasts.findIndex(f => f.latitude === +coords[0] && f.longitude === +coords[1]);
      if (index === -1 || query.startsWith('add')) {
        el.style.transform = `translateX(-${forecasts.length * window.innerWidth}px)`;
      } else {
        el.style.transform = `translateX(-${index * window.innerWidth}px)`;
      }
    } else {
      el.style.transform = `translateX(0)`;
    }
  }, [navigation.path]);

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
    console.log(newForecasts);
    storeForecasts(newForecasts);
    setForecasts(newForecasts);
  }

  const handleLeftClick = () => {
    // "." breaks deep-linking so replace with "x":
    const coords = `${forecasts[0].latitude},${forecasts[0].longitude}`.replace(/\./g, 'x');
    route(`/forecast/${coords}`);
  }

  const handleRightClick = () => {
    route(`/forecast/add`);
  };

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
        <AddLocation />
      </div>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--left'])}
        aria-label="pan right"
        onClick={handleLeftClick}
      >
        <IconLeft />
      </button>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--right'])}
        aria-label="pan right"
        onClick={handleRightClick}
      >
        <IconRight />
      </button>
    </div>
  );
};
