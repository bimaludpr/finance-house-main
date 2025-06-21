import { configureStore } from "@reduxjs/toolkit";
import testimonialReducer from "./testimonialSlice";

export const store = configureStore({
  reducer: {
    testimonialReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
