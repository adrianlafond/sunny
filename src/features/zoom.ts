import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Zoom {
  status: 'in' | 'out';
}

const name = 'zoom';
const initialState = {
  status: 'in',
} as Zoom;

export const zoomSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateZoomStatus: (state: Zoom, action: PayloadAction<Zoom['status']>) => {
      state.status = action.payload;
    },
  }
});

export const { updateZoomStatus } = zoomSlice.actions;

export const zoomReducer = zoomSlice.reducer;
