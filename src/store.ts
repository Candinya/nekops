import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "@/slices/settingsSlice.ts";
import serversReducer from "@/slices/serversSlice.ts";
import snippetsReducer from "@/slices/snippetsSlice.ts";
import encryptionReducer from "@/slices/encryptionSlice.ts";
import connectHistoryReducer from "@/slices/connectHistorySlice.ts";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    servers: serversReducer,
    snippets: snippetsReducer,
    encryption: encryptionReducer,
    connect_history: connectHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
