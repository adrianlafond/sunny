import { FunctionalComponent, h } from 'preact';
import { Router, RouterOnChangeArgs } from 'preact-router';
import { useEffect, useReducer, useRef } from 'preact/hooks';
import classnames from 'classnames';
import { NavigationContext, NavigationContextProps, defaultNavigationContext } from '../../contexts';
import { Content } from '../content';
import style from './style.scss';

type NavigationActionType = {
  type: 'path-change';
  data: RouterOnChangeArgs;
} | {
  type: 'panning-delta';
  data: NavigationContextProps['panningDelta'];
} | {
  type: 'panning-stop';
  data: null;
}

function navigationReducer(
  state: NavigationContextProps,
  action: NavigationActionType): NavigationContextProps {
  const { type, data}  = action;
  switch (type) {
    case 'path-change':
      return {
        ...state,
        path: data.url,
        forecastPath: data.url === '/' || data.url.startsWith('/forecast')
          ? data.url
          : state.forecastPath,
      };
    case 'panning-delta':
      return {
        ...state,
        prePanningPath: state.isPanning ? state.prePanningPath : state.path,
        isPanning: true,
        panningDelta: data,
        panningRouteChangeAxis: Math.abs(data.x) >= Math.abs(data.y) ? 'x' : 'y',
      };
    case 'panning-stop':
      return {
        ...state,
        isPanning: false,
      };
  }
}

const App: FunctionalComponent = () => {
  const dragStart = useRef({ x: 0, y: 0 });

  const [navigation, dispatch] = useReducer(navigationReducer, defaultNavigationContext);

  const isGrabbing = useRef(false);

  function handleRouterChange(event: RouterOnChangeArgs) {
    dispatch({
      type: 'path-change',
      data: event,
    });
  }

  function handleMouseDown(event: MouseEvent) {
    isGrabbing.current = true;
    dragStart.current.x = event.clientX;
    dragStart.current.y = event.clientY;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    if (deltaX !== 0 || deltaY !== 0) {
      dispatch({
        type: 'panning-delta',
        data: {
          x: deltaX * 0.5,
          y: deltaY * 0.5,
        }
      });
    }
  }

  function handleMouseUp() {
    stopDragging();
  }

  function stopDragging() {
    isGrabbing.current = false;
    dispatch({ type: 'panning-stop', data: null });
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      stopDragging();
    };
  }, []);

  const appClass = classnames(style.app, {
    [style['app--panning']]: isGrabbing.current,
  });

  return (
    <NavigationContext.Provider value={navigation}>
      <main class={appClass}>
        <Router onChange={handleRouterChange}>
          <Content default />
        </Router>
      </main>
    </NavigationContext.Provider>
  );
};

export default App;
