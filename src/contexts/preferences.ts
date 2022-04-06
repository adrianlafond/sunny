import { createContext } from 'preact';

export interface Preferences {
  temperatureUnit: 'C' | 'F'
}

export interface PreferencesContextProps {
  preferences: Preferences;
  update: (preferences: Preferences) => void;
}

export const defaultPreferences: Preferences = {
  temperatureUnit: 'C',
};

export const PreferencesContext = createContext<PreferencesContextProps>({
  preferences: defaultPreferences,
  update: (_preferences) => undefined,
});
