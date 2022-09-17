import { createContext } from 'preact'

export type Theme = 'day' | 'night'

export const ThemeContext = createContext<Theme>('day')
