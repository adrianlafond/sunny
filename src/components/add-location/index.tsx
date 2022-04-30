import { FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { RootState } from '../../store';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { Forecast } from '../../services/forecast';
import { NavigationContext } from '../../contexts';
import { NOT_FOUND } from '../../constants';
import { NavigationButton } from '../navigation-button';
import { LocationButton } from '../location-button';
import { Location } from '../../services/geocoding';
import { createStubForecast } from '../../services';
import { addForecast, fetchLocations } from '../../features';

import page from '../shared/page.scss';
import typography from '../shared/typography.scss';
import style from './style.scss';


export const AddLocation: FunctionalComponent = () => {
  const navigationContext = useContext(NavigationContext);

  const data = useAppSelector((state: RootState) => state.locations);
  const dispatch = useAppDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  function isAddPage() {
    return navigationContext.path.startsWith('/add');
  }

  function handleKeyDown(event: KeyboardEvent) {
    const down = event.key === 'ArrowDown';
    const up = event.key === 'ArrowUp';
    if (up || down) {
      const focusEl = document.activeElement;
      const hasFocusIndex = focusEl?.hasAttribute('data-addlocation-index');
      if (hasFocusIndex) {
        const attrValue = focusEl?.getAttribute('data-addlocation-index');
        if (attrValue) {
          const index = +attrValue + (up ? -1 : 1);
          focusIndexElement(index);
        }
      } else {
        focusIndexElement(0);
      }
    }
  }

  function focusIndexElement(index: number) {
    const el = document.querySelector(`[data-addlocation-index="${index}"]`);
    if (el) {
      (el as HTMLElement).focus();
    }
  }

  useEffect(() => {
    if (inputRef.current && isAddPage()) {
      inputRef.current.focus();
    }
  }, [navigationContext.path]);

  useEffect(() => {
    if (isAddPage()) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigationContext.path]);

  const handleForecastsClick = () => {
    route(navigationContext.forecastPath);
  };

  const handleLocationInput = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    fetchLocations(dispatch, input.value);
  }

  function handleAddLocation(location: Location) {
    const { name, latitude, longitude } = location;
    const forecast = createStubForecast(name, latitude, longitude);
    addForecast(dispatch, forecast);
  }

  function overridePointerDown(event: Event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  return (
    <div class={classnames(page.page, style.addlocation)}>
      <div class={classnames(page.page__content, style.addlocation__content)}>
        <div>
          {navigationContext.path === NOT_FOUND ? (
            <h3 class={classnames(typography.h3, style.addlocation__break)}><em>
              Whoops! You requested a page that does not exist.
            </em></h3>
          ) : null}

          <h2 class={typography.h2}>add location</h2>

          <div class={style.addlocation__inputcontainer}>
            <input
              class={style.addlocation__input}
              ref={inputRef}
              name="location"
              placeholder="place name or postal code"
              onInput={handleLocationInput}
              tabIndex={isAddPage() ? 0 : -1}
              spellCheck={false}
              autoComplete="off"
              data-lpignore="true"
              data-addlocation-index="0"
            />
          </div>
        </div>

        <div
          class={style.addlocation__results}
          onMouseDown={overridePointerDown}
          onTouchStart={overridePointerDown}
        >
          <div class={style['addlocation__results-scroll']}>
            <ul class={style['addlocation__results-list']}>
            {data.locations.map((location, index) => (
              <LocationButton
                key={`${location.latitude}--${location.longitude}`}
                index={index}
                location={location}
                onClick={handleAddLocation}
                tabIndex={isAddPage() ? 0 : -1}
              />
            ))}
            </ul>
            {data.loading && <p>Loading...</p>}
          </div>
        </div>
      </div>

      <NavigationButton
        onClick={handleForecastsClick}
        focusable={isAddPage()}
        position="bottom"
      >
        forecasts
      </NavigationButton>
    </div>
  );
};
