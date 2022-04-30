import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { getLocationCoords, LocationResponse, Locations } from '../services/geocoding';

export interface LocationsState extends LocationResponse {
  error: LocationResponse['error'];
  loading: boolean;
  locations: Locations;
}

const name = 'locations';

const initialState = {
  error: null,
  loading: false,
  locations: [],
} as LocationsState;

export const locationsSlice = createSlice({
  name,
  initialState,
  reducers: {
    locationsLoading: state => {
      state.error = null;
      state.loading = true;
    },
    locationsReceived: (state, action: PayloadAction<LocationResponse>) => {
      state.loading = false;
      if (action.payload.error) {
        state.error = action.payload.error;
        state.locations = [];
      } else if (action.payload.data) {
        state.locations = action.payload.data;
      }
    }
  },
});

const { locationsLoading, locationsReceived } = locationsSlice.actions;

export const fetchLocations = async (dispatch: Dispatch, input: string) => {
  dispatch(locationsLoading());
  const response = await getLocationCoords(input);
  dispatch(locationsReceived(response));
};

export const locationsReducer = locationsSlice.reducer;
