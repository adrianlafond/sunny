import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'day' | 'night'

const name = 'theme'
const initialState = 'day' as Theme

export const themeSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateTheme: (_state: Theme, action: PayloadAction<Theme>) => {
      return action.payload
    }
  }
})

export const { updateTheme } = themeSlice.actions

export const themeReducer = themeSlice.reducer
