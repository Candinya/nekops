import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ConnectHistory } from "@/types/connectHistory.ts";
import type { RootState } from "@/store.ts";

const noConnectHistory: ConnectHistory[] = [];

const buildConnectHistoryLocalStorageKey = (workspace: string) =>
  `nekops.connectHistory.${workspace}`;

export const readConnectHistory = createAsyncThunk(
  "connectHistory/read",
  async (_, { getState }): Promise<ConnectHistory[]> => {
    const state = getState() as RootState;
    const key = buildConnectHistoryLocalStorageKey(
      state.settings.current_workspace.id,
    );
    const historyOrNull = localStorage.getItem(key);
    if (historyOrNull !== null) {
      try {
        return JSON.parse(historyOrNull);
      } catch (e) {
        // Invalid history, reset history
        localStorage.removeItem(key);
      }
    }

    // Fallback
    return noConnectHistory;
  },
);

export const saveConnectHistory = createAsyncThunk(
  "connectHistory/save",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const key = buildConnectHistoryLocalStorageKey(
      state.settings.current_workspace.id,
    );
    localStorage.setItem(key, JSON.stringify(state.connect_history));
  },
);

export const connectHistorySlice = createSlice({
  name: "connectHistory",
  initialState: noConnectHistory,
  reducers: {
    appendConnectHistory: (state, action: PayloadAction<string>) => {
      state.unshift({
        ts: Math.floor(new Date().getTime() / 1000), // Seconds
        id: action.payload, // Server ID
      });
    },
    trimConnectHistoryByTime: (state, action: PayloadAction<Date>) => {
      const targetTS = action.payload.getTime() / 1000; // Seconds
      return state.filter((h) => h.ts > targetTS);
    },
    clearConnectHistory: () => {
      return noConnectHistory;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      readConnectHistory.fulfilled,
      (_, action: PayloadAction<ConnectHistory[]>) => action.payload,
    );
    builder.addCase(saveConnectHistory.fulfilled, () => {});
  },
});

export const {
  appendConnectHistory,
  trimConnectHistoryByTime,
  clearConnectHistory,
} = connectHistorySlice.actions;

export default connectHistorySlice.reducer;
