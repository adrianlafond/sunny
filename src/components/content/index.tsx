import { FunctionalComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { Preferences } from '../preferences';
import { Forecasts } from '../forecasts';
import { ForecastContext, ForecastContextProps, NavigationContext, ThemeContext } from '../../contexts';
import { NOT_FOUND, PANNING_ROUTER_CHANGE } from '../../constants';
import { AddLocation } from '../add-location';
import {
  encodeForecastPath,
  Forecast,
  getDefaultForecast,
  restoreForecasts,
  storeForecasts,
} from '../../services';
import style from './style.scss';

export const Content: FunctionalComponent = () => {
  const theme = useContext(ThemeContext);
  const navigation = useContext(NavigationContext);

  function getForecastIndex(forecast: Forecast) {
    return forecastsContext.forecasts.findIndex(f => (
      f.latitude === forecast.latitude && f.longitude === forecast.longitude
    ));
  }

  // Adds or updates the forecast to the forecasts array.
  const updateForecast = useCallback((forecast: Forecast) => {
    const index = getForecastIndex(forecast);
    const forecasts = forecastsContext.forecasts.slice();
    if (index === -1) {
      forecasts.push(forecast);
    } else {
      forecasts[index] = forecast;
    }
    storeForecasts(forecasts);
    setForecastsContext({
      ...forecastsContext,
      forecasts,
    });
  }, []);

  const addForecast = useCallback((forecast: Forecast) => {
    updateForecast(forecast);
    route(encodeForecastPath(forecast));
  }, []);

  const removeForecast = useCallback((forecast: Forecast) => {
    const index = getForecastIndex(forecast);
    if (index !== -1) {
      const forecasts = forecastsContext.forecasts.slice();
      forecasts.splice(index, 1);
      storeForecasts(forecasts);
      setForecastsContext({
        ...forecastsContext,
        forecasts,
      });
      route('/');
    }
  }, []);

  const [forecastsContext, setForecastsContext] = useState<ForecastContextProps>({
    updateForecast,
    addForecast,
    removeForecast,
    forecasts: restoreForecasts() || [getDefaultForecast()],
  });

  const scroll = useRef<HTMLDivElement>(null);

  // Tracks the offset of current position while panning:
  const translateY = useRef(0);

  useEffect(() => {
    if (!scroll.current) {
      return;
    }
    if (navigation.isPanning) {
      // Routes between /add, /forecast, /preferences by panning on Y axis.
      if (navigation.panningRouteChangeAxis === 'y') {
        let newPath = navigation.path;
        if (navigation.prePanningPath.startsWith('/add')) {
          newPath = navigation.panningDelta.y <= window.innerHeight * -PANNING_ROUTER_CHANGE
            ? navigation.forecastPath
            : navigation.prePanningPath;
        } else if (navigation.prePanningPath === '/' || navigation.prePanningPath.startsWith('/forecast')) {
          if (navigation.panningDelta.y >= window.innerHeight * PANNING_ROUTER_CHANGE) {
            newPath = '/add';
          } else if (navigation.panningDelta.y <= window.innerHeight * -PANNING_ROUTER_CHANGE) {
            newPath = '/preferences';
          } else {
            newPath = navigation.prePanningPath;
          }
        } else if (navigation.prePanningPath.startsWith('/preferences')) {
          newPath = navigation.panningDelta.y >= window.innerHeight * PANNING_ROUTER_CHANGE
            ? navigation.forecastPath
            : navigation.prePanningPath;
        }
        if (navigation.path !== newPath) {
          route(newPath);
        }
      }
      scroll.current.style.transform = `translateY(${translateY.current + navigation.panningDelta.y}px)`;
    } else {
      // Pans by route/path change.
      if (navigation.path === '/' || navigation.path.startsWith('/forecast')) {
        translateY.current = -window.innerHeight;
      } else if (navigation.path.startsWith('/preferences')) {
        translateY.current = -window.innerHeight * 2;
      } else if (navigation.path.startsWith('/add')) {
        translateY.current = 0;
      } else {
        route(NOT_FOUND);
        return;
      }
      scroll.current.style.transform = `translateY(${translateY.current}px)`;
    }
  }, [navigation.path, navigation.isPanning, navigation.panningDelta]);

  const scrollClass = classnames(style.content__scroll, {
    [style['content__scroll--panning']]: navigation.isPanning,
  });

  return (
    <ThemeContext.Provider value={theme}>
      <ForecastContext.Provider value={forecastsContext}>
        <div class={style.content}>
          <div class={scrollClass} ref={scroll}>
            <AddLocation onAddForecast={addForecast} />
            <Forecasts />
            <Preferences />
          </div>
        </div>
      </ForecastContext.Provider>
    </ThemeContext.Provider>
  );
};
