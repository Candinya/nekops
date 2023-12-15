import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "@/slices/settingsSlice.ts";
import serversReducer from "@/slices/serversSlice.ts";
import snippetsReducer from "@/slices/snippetsSlice.ts";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    servers: serversReducer,
    snippets: snippetsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
