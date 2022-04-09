import { FunctionalComponent, h } from 'preact';
import { Location } from '../../services/geocoding';

import style from './style.scss';

interface LocationButtonProps extends Omit<h.JSX.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  index: number;
  location: Location;
  onClick: (location: Location) => void;
}

export const LocationButton: FunctionalComponent<LocationButtonProps> = ({
  index,
  location,
  onClick,
  ...buttonProps
}) => {
  function handleClick() {
    onClick(location);
  }

  return (
    <li class={style.locbtn}>
      <button
        {...buttonProps}
        class={style.locbtn__button}
        data-addlocation-index={`${index + 1}`}
        onClick={handleClick}
      >
        <span class={style.locbtn__name}>
          {location.name}
        </span>
        <span class={style.locbtn__location}>
          <span class={style.locbtn__state}>
            {location.state}
          </span>
          <span class={style.locbtn__country}>
           {location.country}
          </span>
        </span>
      </button>
    </li>
  );
};
