import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import classnames from 'classnames';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import { NavigationContext } from '../../contexts';

import style from './style.scss';

export interface NavigationButtonProps extends h.JSX.HTMLAttributes<HTMLButtonElement> {
  children: string;
  focusable?: boolean;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export const NavigationButton: FunctionalComponent<NavigationButtonProps> = ({
  children,
  class: className,
  focusable = true,
  position,
  ...otherProps
}) => {
  const naviationContext = useContext(NavigationContext);
  const zoom = useAppSelector((state: RootState) => state.zoom);

  const chars = children.split('');

  return zoom.status === 'in' ? (
    <button
      {...otherProps}
      tabIndex={focusable ? 0 : -1}
      class={classnames(className, style.navbtn, style[`navbtn--${position}`])}
    >
      <div class={classnames(style.navbtn__label, style[`navbtn__label--${position}`])}>
        {chars.map((c, i) => (
          <span
            class={classnames(style.navbtn__char, style[`navbtn__char--${position}`])}
          >
            {c}
          </span>
        ))}
      </div>
    </button>
  ) : null;
};
