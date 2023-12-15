import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "@/slices/settingsSlice.ts";
import serversReducer from "@/slices/serversSlice.ts";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    servers: serversReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
