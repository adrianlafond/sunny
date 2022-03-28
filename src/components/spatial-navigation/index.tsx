import { FunctionalComponent, h } from 'preact';
import { Preferences } from '../preferences';
import { Forecasts } from '../forecasts';
import style from './style.scss';

export const SpatialNavigation: FunctionalComponent = () => {
  return (
    <div class={style.spatialnav}>
      <div class={style.spatialnav__zoom}>
        <Forecasts />
        <Preferences />
      </div>
    </div>
  );
};
