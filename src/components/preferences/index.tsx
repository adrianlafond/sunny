import { FunctionalComponent, h } from 'preact';
import classnames from 'classnames';
import page from '../shared/page.scss';
import style from './style.scss';

export const Preferences: FunctionalComponent = () => {
  return (
    <div class={classnames(page.page, style.preferences)}>
      <h2>Preferences</h2>
    </div>
  );
};
