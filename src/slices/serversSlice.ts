import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Server } from "@/types/server.ts";
import type { RootState } from "@/store.ts";
import { checkParentDir } from "@/slices/common.ts";

const ServersFileName = "servers.json";

export const readServers = createAsyncThunk(
  "servers/read",
  async (_, { getState }): Promise<Server[]> => {
    // read from local file
    const state: any = getState() as RootState;
    if (await exists(state.settings.data_dir + ServersFileName)) {
      // Read and parse
      const serversFile = await readTextFile(
        state.settings.data_dir + ServersFileName,
      );
      return JSON.parse(serversFile);
    } else {
      return [];
    }
  },
);

export const saveServers = createAsyncThunk(
  "servers/save",
  async (_, { getState }) => {
    // save to local file
    const state: any = getState() as RootState;
    await checkParentDir(state.settings.data_dir);
    await writeTextFile(
      state.settings.data_dir + ServersFileName,
      JSON.stringify(state.servers, null, 2),
    );
  },
);

const noServer: Server[] = [];
export const serversSlice = createSlice({
  name: "servers",
  initialState: noServer,
  reducers: {
    addServer: (state, action) => {
      state.push(action.payload);
    },
    updateServerByIndex: (state, action) => {
      state.splice(action.payload.index, 1, action.payload.server);
    },
    removeServerByIndex: (state, action) => {
      state.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readServers.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(saveServers.fulfilled, () => {});
  },
});

export const { addServer, updateServerByIndex, removeServerByIndex } =
  serversSlice.actions;

export default serversSlice.reducer;
