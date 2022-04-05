import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';
import { NavigationContext } from '../../contexts';

export const Preferences: FunctionalComponent = () => {
  const { forecastPath } = useContext(NavigationContext);

  const handleForecastsClick = () => {
    route(forecastPath);
  };

  const handleDown = (event: MouseEvent) => {
    event.stopImmediatePropagation();
  }

  return (
    <div class={classnames(page.page, style.preferences)}>
      <h2>Preferences</h2>
      <button
        class={style.preferences__navbtn}
        onClick={handleForecastsClick}
        onMouseDown={handleDown}
      >
        forecasts
      </button>
    </div>
  );
};
