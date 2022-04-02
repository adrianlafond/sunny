import { FunctionalComponent, ComponentChildren, h } from 'preact';
import { useRef } from 'preact/hooks';
import { Content } from '../content';
import style from './style.scss';

interface SpatialNavigationProps {
  children: ComponentChildren;
}

export const SpatialNavigation: FunctionalComponent<SpatialNavigationProps> = ({ children }) => {
  const container = useRef<HTMLDivElement>(null);
  return (
      <div
        class={style.spatialnav}
        ref={container}
      >
        {children}
      </div>
  );
};
