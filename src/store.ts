import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "@/slices/settingsSlice.ts";
import serversReducer from "@/slices/serversSlice.ts";
import snippetsReducer from "@/slices/snippetsSlice.ts";
import encryptionReducer from "@/slices/encryptionSlice.ts";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    servers: serversReducer,
    snippets: snippetsReducer,
    encryption: encryptionReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
