import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Navigation {
  /**
   * The current navigation path.
   */
  path: string

  /**
   * The most current forecast navigation path. Used to navigate back to last
   * forecast from another section, such as Preferences.
   */
  forecastPath: string

  /**
   * The path just before panning started. Used to reset path if user pans back.
   */
  prePanningPath: string

  isAddLocation: boolean

  isPanning: boolean
  panningDelta: {
    x: number
    y: number
  }
  panningRouteChangeAxis: 'x' | 'y'
}

const name = 'navigation'
const initialState = {
  path: '/',
  forecastPath: '/',
  prePanningPath: '/',
  isAddLocation: false,
  isPanning: false,
  panningDelta: { x: 0, y: 0 },
  panningRouteChangeAxis: 'x'
} as Navigation

export const navigationSlice = createSlice({
  name,
  initialState,
  reducers: {
    updatePath: (state: Navigation, action: PayloadAction<Navigation['path']>) => {
      const isForecast = action.payload === '/' || action.payload.startsWith('/forecast')
      state.path = action.payload
      state.forecastPath = isForecast ? state.path : state.forecastPath
      state.prePanningPath = state.isPanning ? state.prePanningPath : state.path
      state.isAddLocation = !isForecast && state.path.startsWith('/add')
    },

    updatePanning: (state: Navigation, action: PayloadAction<Navigation['isPanning']>) => {
      state.isPanning = action.payload
    },

    updatePanningDelta: (state: Navigation, action: PayloadAction<Navigation['panningDelta']>) => {
      state.isPanning = true
      state.panningDelta = action.payload
      state.panningRouteChangeAxis = Math.abs(action.payload.x) >= Math.abs(action.payload.y) ? 'x' : 'y'
    }
  }
})

export const {
  updatePath,
  updatePanning,
  updatePanningDelta
} = navigationSlice.actions

export const navigationReducer = navigationSlice.reducer
