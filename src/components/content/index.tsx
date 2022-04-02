import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { Preferences } from '../preferences';
import { Forecasts } from '../forecasts';
import { NavigationContext, ThemeContext } from '../../contexts';
import style from './style.scss';

export const Content: FunctionalComponent = () => {
  const theme = useContext(ThemeContext);
  const navigation = useContext(NavigationContext);

  const [pressed, setPressed] = useState(false);

  const scroll = useRef<HTMLDivElement>(null);

  // Tracks the offset of current position while dragging:
  const translateY = useRef(0);

  // On dragging change, drag the content up/down and change the route in response.
  useEffect(() => {
    if (!scroll.current) {
      return;
    }
    if (navigation.isPanning) {
      if (navigation.panningRouteChangeAxis === 'y') {
        const isPrefs = navigation.prePanningPath.startsWith('/preferences');
        let newPath = navigation.path;
        if (isPrefs) {
          newPath = navigation.panningDelta.y >= window.innerHeight * 0.25
            ? navigation.forecastPath
            : navigation.prePanningPath;
        } else if (!isPrefs) {
          newPath = navigation.panningDelta.y <= window.innerHeight * -0.25
            ? '/preferences'
            : navigation.prePanningPath;
        }
        if (navigation.path !== newPath) {
          route(newPath);
        }
      }
      scroll.current.style.transform = `translateY(${translateY.current + navigation.panningDelta.y}px)`;
    } else {
      translateY.current = navigation.path.startsWith('/preferences') ? -window.innerHeight : 0;
      scroll.current.style.transform = `translateY(${translateY.current}px)`;
    }
  }, [navigation.path, navigation.isPanning, navigation.panningDelta]);

  const contentClass = classnames(style.content, {
    [style['content--dragging']]: pressed,
  });
  const scrollClass = classnames(style.content__scroll, {
    [style['content__scroll--dragging']]: navigation.isPanning,
  });

  function handlePress() {
    setPressed(true);
  }

  function handleUnpress() {
    setPressed(false);
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div class={contentClass} onMouseDown={handlePress} onMouseUp={handleUnpress}>
        <div class={scrollClass} ref={scroll}>
          <Forecasts />
          <Preferences />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
