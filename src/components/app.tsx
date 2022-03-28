import { FunctionalComponent, h } from 'preact';
import { Route, Router, RouterOnChangeArgs } from 'preact-router';

import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import { SpatialNavigation } from './spatial-navigation';

const App: FunctionalComponent = () => {
    // TODO: drive spatial navigation instead of pages via URL
    function handleRouterChange(event: RouterOnChangeArgs) {
        console.log(event.url);
    }

    return (
        <div id="preact_root">
            <Header />
            <SpatialNavigation />
            <Router onChange={handleRouterChange}>
                <Route path="/" component={Home} />
                <Route path="/profile/" component={Profile} user="me" />
                <Route path="/profile/:user" component={Profile} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
