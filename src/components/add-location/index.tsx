import { FunctionalComponent, h } from 'preact';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';

export const AddLocation: FunctionalComponent = () => {
  return (
    <div class={classnames(page.page, style.addlocation)}>
      <h2>Add Location</h2>
    </div>
  );
};
