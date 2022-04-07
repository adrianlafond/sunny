import { createContext } from 'preact';

export interface NavigationContextProps {
  path: string;
  forecastPath: string;
  prePanningPath: string;
  isPanning: boolean;
  panningDelta: {
    x: number;
    y: number;
  };
  panningRouteChangeAxis: 'x' | 'y';
}

export const defaultNavigationContext: NavigationContextProps = {
  path: '/',
  forecastPath: '/',
  prePanningPath: '/',
  isPanning: false,
  panningDelta: { x: 0, y: 0 },
  panningRouteChangeAxis: 'x',
};

export const NavigationContext = createContext<NavigationContextProps>({
  ...defaultNavigationContext,
});
