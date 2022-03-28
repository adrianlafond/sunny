import { FunctionalComponent, h } from 'preact';
import { AddLocation } from '../add-location';
import { Preferences } from '../preferences';
import { WeatherLocation } from '../weather-location';
import style from './style.scss';

export const SpatialNavigation: FunctionalComponent = () => {
  return (
    <div class={style.spatialnav}>
      <div class={style.spatialnav__zoom}>
        <div class={style.spatialnav__locations}>
          <WeatherLocation />
          <AddLocation />
        </div>
        <Preferences />
      </div>
    </div>
  );
};
