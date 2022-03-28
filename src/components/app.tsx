import { FunctionalComponent, h } from 'preact';
import { Route, Router, RouterOnChangeArgs } from 'preact-router';

import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFoundPage from '../routes/notfound';
import { SpatialNavigation } from './spatial-navigation';

const App: FunctionalComponent = () => {
    // TODO: drive spatial navigation instead of pages via URL
    function handleRouterChange(event: RouterOnChangeArgs) {
        console.log(event.url);
    }

    return (
        <div id="preact_root">
            <Router onChange={handleRouterChange}>
                <SpatialNavigation default />
            </Router>
        </div>
    );
};

export default App;
