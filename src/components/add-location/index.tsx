import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { Forecast } from '../../services/forecast';
import { NavigationContext } from '../../contexts';
import { NOT_FOUND } from '../../constants';

import page from '../shared/page.scss';
import style from './style.scss';

interface AddLocationProps {
  onAddForecast: (forecast: Forecast) => void;
}

export const AddLocation: FunctionalComponent<AddLocationProps> = () => {
  const navigation = useContext(NavigationContext);

  const handleForecastsClick = () => {
    route(navigation.forecastPath);
  };

  const handleDown = (event: MouseEvent) => {
    event.stopImmediatePropagation();
  }

  return (
    <div class={classnames(page.page, style.addlocation)}>
      <h2>Add Location</h2>

      <h3>context: {navigation.path === NOT_FOUND ? 'Not Found' : 'n/a'}</h3>
      <button
        class={style.addlocation__navbtn}
        onClick={handleForecastsClick}
        onMouseDown={handleDown}
      >
        forecasts
      </button>
    </div>
  );
};
