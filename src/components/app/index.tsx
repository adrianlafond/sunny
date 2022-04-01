import { FunctionalComponent, h } from 'preact';
import { Router, RouterOnChangeArgs } from 'preact-router';
import { useContext, useEffect } from 'preact/hooks';
import { SpatialNavigation } from '../spatial-navigation';
import { NavigationContext } from '../../contexts';
import style from './style.scss';

const App: FunctionalComponent = () => {
  const navigation = useContext(NavigationContext);

  // TODO: drive spatial navigation instead of pages via URL
  function handleRouterChange(event: RouterOnChangeArgs) {
    navigation.path = event.url;
    if (navigation.path === '/' || navigation.path.startsWith('/forecast')) {
      navigation.mostRecentForecast = navigation.path;
    }
  }

  return (
    <main class={style.app}>
      <NavigationContext.Provider value={navigation}>
        <Router onChange={handleRouterChange}>
          <SpatialNavigation default />
        </Router>
      </NavigationContext.Provider>
    </main>
  );
};

export default App;
