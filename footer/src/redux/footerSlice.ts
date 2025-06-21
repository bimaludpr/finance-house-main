import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define the shape of your state
interface FooterState {
  [key: string]: any; // allows dynamic keys
  value: any;
}

// Initial state
const initialState: FooterState = {
  value: true,
};

// Slice definition
export const footerSlice = createSlice({
  name: "footerReducer",
  initialState,
  reducers: {
    updateRedux: (
      state: FooterState,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});
export const { updateRedux } = footerSlice.actions;

export const value = (state: RootState) => state.footerReducer.value;

export default footerSlice.reducer;
