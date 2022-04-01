import { FunctionalComponent, h } from 'preact';
import { Content } from '../content';
import style from './style.scss';

export const SpatialNavigation: FunctionalComponent = () => {
  return (
      <div class={style.spatialnav}>
        <Content />
      </div>
  );
};
