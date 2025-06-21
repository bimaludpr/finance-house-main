import { configureStore } from "@reduxjs/toolkit";
import popupReducer from "./popupSlice";

export const store = configureStore({
  reducer: {
    popupReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
