import { createContext } from 'preact';

export const NavigationContext = createContext<{
  path: string;
  dragging: boolean;
}>({
  path: '/',
  dragging: false,
});
