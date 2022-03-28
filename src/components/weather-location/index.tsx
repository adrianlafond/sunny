import { FunctionalComponent, h } from 'preact';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';

export const WeatherLocation: FunctionalComponent = () => {
  return (
    <div class={classnames(page.page, style.location)}>
      <h2>Weather Location</h2>
    </div>
  );
};
