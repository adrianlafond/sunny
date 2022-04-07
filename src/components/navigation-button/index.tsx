import { Fragment, FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import classNames from 'classnames';
import { ZoomContext } from '../../contexts';

import style from './style.scss';

export interface NavigationButtonProps extends h.JSX.HTMLAttributes<HTMLButtonElement> {
  children: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export const NavigationButton: FunctionalComponent<NavigationButtonProps> = ({
  children,
  class: className,
  position,
  ...otherProps
}) => {
  const zoomContext = useContext(ZoomContext);

  const chars = children.split('');

  return zoomContext.zoom === 'in' ? (
    <button
      {...otherProps}
      class={classNames(className, style.navbtn, style[`navbtn--${position}`])}
    >
      <div class={style.navbtn__label}>
        {chars.map((c, i) => (
          <span
            class={style.navbtn__char}
          >
            {c}
          </span>
        ))}
      </div>
    </button>
  ) : null;
};
