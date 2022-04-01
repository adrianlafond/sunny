import { FunctionalComponent, h } from 'preact';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';
import { Forecast } from '../../services/forecast';

interface AddLocationProps {
  onAddForecast: (forecast: Forecast) => void;
}

export const AddLocation: FunctionalComponent<AddLocationProps> = () => {
  return (
    <div class={classnames(page.page, style.addlocation)}>
      <h2>Add Location</h2>
    </div>
  );
};
