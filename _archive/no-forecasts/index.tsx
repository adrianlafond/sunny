import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';

export const NoForecasts: FunctionalComponent = () => {
  return (
    <div class={classnames(page.page, style.noforecasts)}>
      <h2>No Forecasts</h2>
      <Link href="/add">Add Forecasts</Link>
    </div>
  );
};
