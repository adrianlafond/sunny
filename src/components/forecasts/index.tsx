import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useMemo, useRef } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { RootState } from '../../store';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { ForecastLocation } from '../forecast-location';
import { NoForecasts } from '../no-forecasts';
import { NavigationButton } from '../navigation-button';
import { NavigationContext } from '../../contexts';
import { decodeForecastPath, encodeForecastPath, storeForecasts } from '../../services';
import { NOT_FOUND, PANNING_ROUTER_CHANGE } from '../../constants';

import style from './style.scss';

export const Forecasts: FunctionalComponent = () => {
  const forecasts = useAppSelector((state: RootState) => state.forecasts);

  useEffect(() => {
    storeForecasts(forecasts);
  }, [forecasts]);

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
        return forecasts.findIndex(f => f.latitude === latitude && f.longitude === longitude);
      }
    }
    return -1;
  };

  const { leftForecast, rightForecast } = useMemo(() => {
    const index = getForecastIndex();
    const left = index > 0
      ? forecasts[index - 1]
      : null;
    const right = index < forecasts.length - 1
      ? forecasts[index + 1]
      : null;
    return { leftForecast: left, rightForecast: right };
  }, [navigation.forecastPath]);

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
    if (leftForecast) {
      route(encodeForecastPath(leftForecast));
    }
  }

  const handleRightClick = () => {
    if (rightForecast) {
      route(encodeForecastPath(rightForecast));
    }
  };

  const handlePrefsClick = () => {
    route(`/preferences`);
  }

  const handleAddClick = () => {
    route(`/add`);
  }

  const carouselClass = classnames(style.forecasts__carousel, {
    [style['forecasts__carousel--dragging']]: navigation.isPanning,
  });

  return (
    <div class={style.forecasts}>
      {forecasts.length ? (
        <div class={carouselClass} ref={carousel}>
          {forecasts.map(forecast => (
            <ForecastLocation
              key={`${forecast.latitude},${forecast.longitude}`}
              forecast={forecast}
            />
          ))}
        </div>
      ) : (
        <NoForecasts />
      )}
      <NavigationButton
        onClick={handleAddClick}
        focusable={isForecastPage()}
        position="top"
      >
        add forecast
      </NavigationButton>
      {leftForecast ? (
        <NavigationButton
          onClick={handleLeftClick}
          focusable={isForecastPage()}
          position="left"
        >
          {leftForecast.name}
        </NavigationButton>
      ) : null}
      {rightForecast ? (
        <NavigationButton
          onClick={handleRightClick}
          focusable={isForecastPage()}
          position="right"
        >
          {rightForecast.name}
        </NavigationButton>
      ) : null}
      <NavigationButton
        onClick={handlePrefsClick}
        focusable={isForecastPage()}
        position="bottom"
      >
        preferences
      </NavigationButton>
    </div>
  );
};
