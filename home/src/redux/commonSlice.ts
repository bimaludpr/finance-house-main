import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define the shape of your state
interface CommonState {
  [key: string]: any; // allows dynamic keys
  value: any;
}

// Initial state
const initialState: CommonState = {
  value: true,
};

// Slice definition
export const commonSlice = createSlice({
  name: 'commonReducer',
  initialState,
  reducers: {
    updateRedux: (state: CommonState, action: PayloadAction<{ key: string; value: any }>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});
export const { updateRedux } = commonSlice.actions;

export const value = (state: RootState) => state.commonReducer.value;

export default commonSlice.reducer;
