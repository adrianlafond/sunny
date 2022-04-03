import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { Preferences } from '../preferences';
import { Forecasts } from '../forecasts';
import { NavigationContext, ThemeContext } from '../../contexts';
import { PANNING_ROUTER_CHANGE } from '../../constants';
import style from './style.scss';
import { AddLocation } from '../add-location';
import { Forecast } from '../../services/forecast';

export const Content: FunctionalComponent = () => {
  const theme = useContext(ThemeContext);
  const navigation = useContext(NavigationContext);

  const [pressed, setPressed] = useState(false);

  const scroll = useRef<HTMLDivElement>(null);

  // Tracks the offset of current position while dragging:
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
        route('/add');
        return;
      }
      scroll.current.style.transform = `translateY(${translateY.current}px)`;
    }
  }, [navigation.path, navigation.isPanning, navigation.panningDelta]);

  function handlePress() {
    setPressed(true);
  }

  function handleUnpress() {
    setPressed(false);
  }

  function addForecast(forecast: Forecast) {
    //
  }

  const contentClass = classnames(style.content, {
    [style['content--dragging']]: pressed,
  });
  const scrollClass = classnames(style.content__scroll, {
    [style['content__scroll--dragging']]: navigation.isPanning,
  });

  return (
    <ThemeContext.Provider value={theme}>
      <div class={contentClass} onMouseDown={handlePress} onMouseUp={handleUnpress}>
        <div class={scrollClass} ref={scroll}>
          <AddLocation onAddForecast={addForecast} />
          <Forecasts />
          <Preferences />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
