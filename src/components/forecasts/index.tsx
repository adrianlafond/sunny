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

  // Element upon which translate is applied during navigation and dragging:
  const carousel = useRef<HTMLDivElement>(null);

  // Tracks the offset of current position while dragging:
  const translateX = useRef(0);

  const navigation = useContext(NavigationContext);

  function isAddPage(key: 'forecastPath' | 'prePanningPath' = 'forecastPath') {
    return navigation[key].startsWith('/forecast/add');
  }

  function isForecastPage(key: 'forecastPath' | 'prePanningPath' = 'forecastPath') {
    return navigation[key] === '/' || navigation[key].startsWith('/forecast');
  }

  function getForecastIndex(key: 'forecastPath' | 'prePanningPath' = 'forecastPath') {
    if (navigation[key] === '/') {
      return 0;
    }
    if (isAddPage(key)) {
      return -1;
    }
    if (navigation[key].startsWith('/forecast')) {
      const coords = decodeForecastPath(navigation[key]);
      if (coords) {
        const { latitude, longitude } = coords;
        return forecasts.findIndex(f => f.latitude === latitude && f.longitude === longitude);
      }
    }
    return -1;
  };

  // On navigation path change, slides the relevant forecast into view.
  useEffect(() => {
    if (!carousel.current || navigation.isPanning) {
      return;
    }
    if (isAddPage()) {
      translateX.current = forecasts.length * -window.innerWidth;
      carousel.current.style.transform = `translateX(${translateX.current}px)`;
    } else {
      const index = getForecastIndex();
      if (isForecastPage() && index === -1) {
        route('/forecast/add');
      } else {
        translateX.current = index * -window.innerWidth;
        carousel.current.style.transform = `translateX(${translateX.current}px)`;
      }
    }
  }, [navigation.forecastPath, navigation.isPanning]);

  // Updates the transform translate position while dragging.
  useEffect(() => {
    if (navigation.isPanning && carousel.current) {
      const { x } = navigation.panningDelta;
      if (isForecastPage('prePanningPath') && navigation.panningRouteChangeAxis === 'x') {
        const index = getForecastIndex('prePanningPath');
        if (index !== -1 || isAddPage('prePanningPath')) {
          let newPath = navigation.prePanningPath;
          const goLeft = navigation.panningDelta.x >= window.innerWidth * 0.25;
          const goRight = navigation.panningDelta.x <= window.innerWidth * -0.25;
          if (goLeft) {
            if (isAddPage('prePanningPath')) {
              newPath = encodeForecastPath(forecasts[forecasts.length - 1]);
            } else if (index > 0) {
              newPath = encodeForecastPath(forecasts[index - 1]);
            }
          } else if (goRight) {
            if (index < forecasts.length - 1) {
              newPath = encodeForecastPath(forecasts[index + 1]);
            } else {
              newPath = '/forecast/add';
            }
          }
          if (navigation.path !== newPath) {
            route(newPath);
          }
        }
      }
      carousel.current.style.transform = `translateX(${x + translateX.current}px)`;
    }
  }, [navigation.isPanning, navigation.panningDelta]);

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
    if (isAddPage()) {
      route(encodeForecastPath(forecasts[forecasts.length - 1]));
    } else {
      const index = getForecastIndex();
      if (index === -1) {
        route('/');
      } else if (index > 0) {
        route(encodeForecastPath(forecasts[index - 1]));
      }
    }
  }

  const handleRightClick = () => {
    if (isAddPage()) {
      return;
    }
    const index = getForecastIndex();
    if (index === -1) {
      route('/');
    } else if (index < forecasts.length - 1) {
      route(encodeForecastPath(forecasts[index + 1]));
    } else {
      route('/forecast/add');
    }
  };

  const handlePrefsClick = () => {
    route(`/preferences`);
  }

  const handleDown = (event: MouseEvent) => {
    event.stopImmediatePropagation();
  }

  const carouselClass = classnames(style.forecasts__carousel, {
    [style['forecasts__carousel--dragging']]: navigation.isPanning,
  });

  return (
    <div class={style.forecasts}>
      <div class={carouselClass} ref={carousel}>
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
        onMouseDown={handleDown}
      >
        <IconLeft />
      </button>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--right'])}
        aria-label="next"
        onClick={handleRightClick}
        onMouseDown={handleDown}
      >
        <IconRight />
      </button>
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--prefs'])}
        aria-label="preferences"
        onClick={handlePrefsClick}
        onMouseDown={handleDown}
      >
        Prefs
      </button>
    </div>
  );
};
