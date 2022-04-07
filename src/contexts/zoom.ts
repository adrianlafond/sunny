import { createContext } from 'preact';

export interface ZoomContextProps {
  zoom: 'in' | 'out';
}

export const defaultZoomContext: ZoomContextProps = {
  zoom: 'in',
};

export const ZoomContext = createContext<ZoomContextProps>(defaultZoomContext);
