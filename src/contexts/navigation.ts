import { createContext } from 'preact';

export const NavigationContext = createContext<{
  path: string;
  mostRecentForecast: string;
  dragging: boolean;
}>({
  path: '/',
  mostRecentForecast: '/',
  dragging: false,
});
