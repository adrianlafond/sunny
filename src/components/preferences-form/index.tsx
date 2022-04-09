import { FunctionalComponent, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { NavigationContext, Preferences, PreferencesContext } from '../../contexts';
import { NavigationButton } from '../navigation-button';
import page from '../shared/page.scss';
import typography from '../shared/typography.scss';
import style from './style.scss';

export const PreferencesForm: FunctionalComponent = () => {
  const { path, forecastPath } = useContext(NavigationContext);
  const { preferences, update } = useContext(PreferencesContext);

  // Prevents global spatial navigation panning.
  const onDown = (event: Event) => {
    event.stopPropagation();
  };

  const handleForecastsClick = () => {
    route(forecastPath);
  };

  const handleTempUnitChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    update({
      ...preferences,
      temperatureUnit: select.value as Preferences['temperatureUnit'],
    })
  }

  return (
    <div class={classnames(page.page, style.preferences)}>
      <div class={page.page__content}>
        <h2 class={typography.h2}>Preferences</h2>

        <label>Temperature unit</label>
        <select onChange={handleTempUnitChange} onMouseDown={onDown} onTouchStart={onDown}>
          <option value="C" selected={preferences.temperatureUnit === 'C'}>celcius</option>
          <option value="F" selected={preferences.temperatureUnit === 'F'}>fahrenheit</option>
        </select>
      </div>

      <NavigationButton
        onClick={handleForecastsClick}
        focusable={path.startsWith('/preferences')}
        position="top"
      >
        forecasts
      </NavigationButton>
    </div>
  );
};
