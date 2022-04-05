import { createContext } from 'preact';
import { getDefaultForecast } from '../services/default-forecast';
import { Forecast } from '../services/forecast';

export interface ForecastContextProps {
  updateForecast: (forecast: Forecast) => void;
  addForecast: (forecast: Forecast) => void;
  removeForecast: (forecast: Forecast) => void;
  forecasts: Forecast[];
}

export const ForecastContext = createContext<ForecastContextProps>({
  updateForecast: (_forecast: Forecast) => undefined,
  addForecast: (_forecast: Forecast) => undefined,
  removeForecast: (_forecast: Forecast) => undefined,
  forecasts: [getDefaultForecast()],
});
