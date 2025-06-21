import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define the shape of your state
interface PopupState {
  [key: string]: any; // allows dynamic keys
  value: any;
}

// Initial state
const initialState: PopupState = {
  value: true,
};

// Slice definition
export const popupSlice = createSlice({
  name: "popupReducer",
  initialState,
  reducers: {
    updateRedux: (
      state: PopupState,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});
export const { updateRedux } = popupSlice.actions;

export const value = (state: RootState) => state.popupReducer.value;

export default popupSlice.reducer;
