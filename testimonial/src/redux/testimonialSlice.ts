import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define the shape of your state
interface TestimonialState {
  [key: string]: any; // allows dynamic keys
  value: any;
}

// Initial state
const initialState: TestimonialState = {
  value: true,
};

// Slice definition
export const testimonialSlice = createSlice({
  name: "testimonialReducer",
  initialState,
  reducers: {
    updateRedux: (
      state: TestimonialState,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});
export const { updateRedux } = testimonialSlice.actions;

export const value = (state: RootState) => state.testimonialReducer.value;

export default testimonialSlice.reducer;
