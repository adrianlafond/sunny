import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { IconLeft, IconRight } from '../icons';
import { ForecastLocation } from '../forecast-location';
import { NoForecasts } from '../no-forecasts';
import { ForecastContext, NavigationContext } from '../../contexts';
import { decodeForecastPath, encodeForecastPath } from '../../services';
import { NOT_FOUND, PANNING_ROUTER_CHANGE } from '../../constants';

import style from './style.scss';

export const Forecasts: FunctionalComponent = () => {
  const forecastsContext = useContext(ForecastContext);

  // Element upon which translate is applied during navigation and dragging:
  const carousel = useRef<HTMLDivElement>(null);

  // Tracks the offset of current position while dragging:
  const translateX = useRef(0);

  const navigation = useContext(NavigationContext);

  function isForecastPage(key: 'forecastPath' | 'prePanningPath' = 'forecastPath') {
    return navigation[key] === '/' || navigation[key].startsWith('/forecast');
  }

  function getForecastIndex(key: 'forecastPath' | 'prePanningPath' = 'forecastPath') {
    if (navigation[key] === '/') {
      return 0;
    }
    if (navigation[key].startsWith('/forecast')) {
      const coords = decodeForecastPath(navigation[key]);
      if (coords) {
        const { latitude, longitude } = coords;
        return forecastsContext.forecasts.findIndex(f => f.latitude === latitude && f.longitude === longitude);
      }
    }
    return -1;
  };

  // On navigation path change, slides the relevant forecast into view.
  useEffect(() => {
    if (!carousel.current || navigation.isPanning) {
      return;
    }
    const index = getForecastIndex();
    if (isForecastPage() && index === -1) {
      route(NOT_FOUND);
    } else {
      translateX.current = index * -window.innerWidth;
      carousel.current.style.transform = `translateX(${translateX.current}px)`;
    }
  }, [navigation.forecastPath, navigation.isPanning]);

  // Updates the transform translate position while dragging.
  useEffect(() => {
    if (navigation.isPanning && carousel.current) {
      const { x } = navigation.panningDelta;
      if (isForecastPage('prePanningPath') && navigation.panningRouteChangeAxis === 'x') {
        const index = getForecastIndex('prePanningPath');
        if (index !== -1) {
          let newPath = navigation.prePanningPath;
          const goLeft = navigation.panningDelta.x >= window.innerWidth * PANNING_ROUTER_CHANGE;
          const goRight = navigation.panningDelta.x <= window.innerWidth * -PANNING_ROUTER_CHANGE;
          const { forecasts } = forecastsContext;
          if (goLeft && index > 0) {
            newPath = encodeForecastPath(forecasts[index - 1]);
          } else if (goRight && index < forecasts.length - 1) {
            newPath = encodeForecastPath(forecasts[index + 1]);
          }
          if (navigation.path !== newPath) {
            route(newPath);
          }
        }
      }
      carousel.current.style.transform = `translateX(${x + translateX.current}px)`;
    }
  }, [navigation.isPanning, navigation.panningDelta]);

  const handleLeftClick = () => {
    const index = getForecastIndex();
    if (index > 0) {
      route(encodeForecastPath(forecastsContext.forecasts[index - 1]));
    }
  }

  const handleRightClick = () => {
    const index = getForecastIndex();
    if (index < forecastsContext.forecasts.length - 1) {
      route(encodeForecastPath(forecastsContext.forecasts[index + 1]));
    }
  };

  const handlePrefsClick = () => {
    route(`/preferences`);
  }

  const handleAddClick = () => {
    route(`/add`);
  }

  const handleDown = (event: MouseEvent) => {
    event.stopImmediatePropagation();
  }

  const carouselClass = classnames(style.forecasts__carousel, {
    [style['forecasts__carousel--dragging']]: navigation.isPanning,
  });

  return (
    <div class={style.forecasts}>
      {forecastsContext.forecasts.length ? (
        <div class={carouselClass} ref={carousel}>
          {forecastsContext.forecasts.map(forecast => (
            <ForecastLocation
              key={`${forecast.latitude},${forecast.longitude}`}
              forecast={forecast}
              onForecastUpdate={forecastsContext.updateForecast}
              onForecastDelete={forecastsContext.removeForecast}
            />
          ))}
        </div>
      ) : (
        <NoForecasts />
      )}
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
      <button
        class={classnames(style.forecasts__btn, style['forecasts__btn--add'])}
        aria-label="add forecast"
        onClick={handleAddClick}
        onMouseDown={handleDown}
      >
        Add Forecast
      </button>
    </div>
  );
};
