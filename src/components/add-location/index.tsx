import { FunctionalComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { route } from 'preact-router';
import classnames from 'classnames';
import { Forecast } from '../../services/forecast';
import { ForecastContext, NavigationContext } from '../../contexts';
import { NOT_FOUND } from '../../constants';

import page from '../shared/page.scss';
import style from './style.scss';
import { getLocationCoords, Location, Locations } from '../../services/geocoding';
import { createStubForecast } from '../../services';

interface AddLocationProps {
  onAddForecast: (forecast: Forecast) => void;
}

export const AddLocation: FunctionalComponent<AddLocationProps> = () => {
  const navigationContext = useContext(NavigationContext);
  const forecastsContext = useContext(ForecastContext);

  const [locations, setLocations] = useState<Locations>([]);

  const handleForecastsClick = () => {
    route(navigationContext.forecastPath);
  };

  const handleDown = (event: MouseEvent) => {
    event.stopImmediatePropagation();
  }

  const submitGeocode = (event: Event) => {
    event.preventDefault();
  }

  const handleLocationInput = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const response = await getLocationCoords(input.value);
    if (response.error) {
      console.log(response.error);
      setLocations([]);
    } else if (response.data) {
      setLocations(response.data);
    }
  }

  function handleAddLocation(location: Location) {
    const { name, latitude, longitude } = location;
    forecastsContext.addForecast(createStubForecast(name, latitude, longitude));
    setLocations([]);
  }

  return (
    <div class={classnames(page.page, style.addlocation)}>
      <h2>Add Location</h2>

      <h3>context: {navigationContext.path === NOT_FOUND ? 'Not Found' : 'n/a'}</h3>

      <form onSubmit={submitGeocode}>
        <input name="location" onInput={handleLocationInput} />
      </form>

      {locations.map(loc => (
        <p>
          <button onClick={() => handleAddLocation(loc)}>
            <strong>{loc.name}</strong> {loc.state} {loc.country} {loc.latitude}, {loc.longitude}
          </button>
        </p>
      ))}

      <button
        class={style.addlocation__navbtn}
        onClick={handleForecastsClick}
        onMouseDown={handleDown}
      >
        forecasts
      </button>
    </div>
  );
};
