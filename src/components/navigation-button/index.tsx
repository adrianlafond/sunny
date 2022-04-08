import { Fragment, FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import classNames from 'classnames';
import { NavigationContext, ZoomContext } from '../../contexts';

import style from './style.scss';

export interface NavigationButtonProps extends h.JSX.HTMLAttributes<HTMLButtonElement> {
  children: string;
  path: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export const NavigationButton: FunctionalComponent<NavigationButtonProps> = ({
  children,
  class: className,
  path,
  position,
  ...otherProps
}) => {
  const naviationContext = useContext(NavigationContext);
  const zoomContext = useContext(ZoomContext);

  const chars = children.split('');

  return zoomContext.zoom === 'in' ? (
    <button
      {...otherProps}
      tabIndex={naviationContext.path.startsWith(path) ? 0 : -1}
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
