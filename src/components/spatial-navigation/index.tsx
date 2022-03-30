import { FunctionalComponent, h } from 'preact';
import { useContext, useRef } from 'preact/hooks';;
import { Preferences } from '../preferences';
import { Forecasts } from '../forecasts';
import style from './style.scss';
import { ThemeContext } from '../../contexts';

export const SpatialNavigation: FunctionalComponent = () => {
  const theme = useContext(ThemeContext);

  return (
    <ThemeContext.Provider value={theme}>
      <div class={style.spatialnav}>
        <div class={style.spatialnav__zoom}>
          <Forecasts />
          <Preferences />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
