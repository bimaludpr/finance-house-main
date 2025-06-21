import { configureStore } from "@reduxjs/toolkit";
import footerReducer from "./footerSlice";

export const store = configureStore({
  reducer: {
    footerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
