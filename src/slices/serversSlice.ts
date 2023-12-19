import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Server } from "@/types/server.ts";
import type { RootState } from "@/store.ts";
import { checkParentDir } from "@/slices/common.ts";

const ServersIndexFileName = "servers.json";
const ServersBaseDir = "servers/";

const noServer: Server[] = [];

export const readServers = createAsyncThunk(
  "servers/read",
  async (_, { getState }): Promise<Server[]> => {
    const state = getState() as RootState;
    if (await exists(state.settings.data_dir + ServersIndexFileName)) {
      // Read index file
      const serversIndexFile = await readTextFile(
        state.settings.data_dir + ServersIndexFileName,
      );
      const serversIndex = JSON.parse(serversIndexFile);
      // Read detailed server configurations
      const servers: Server[] = [];
      for (const serverConfigFileName of serversIndex) {
        const serverConfigFileNameFull =
          state.settings.data_dir + ServersBaseDir + serverConfigFileName;
        if (await exists(serverConfigFileNameFull)) {
          servers.push(
            JSON.parse(await readTextFile(serverConfigFileNameFull)),
          );
        }
      }
      return servers;
    } else {
      return noServer;
    }
  },
);

export const saveServers = createAsyncThunk(
  "servers/save",
  async (_, { getState }) => {
    const state: any = getState() as RootState;
    await checkParentDir(state.settings.data_dir + ServersBaseDir);
    // Write detailed server configurations
    const serversIndex: string[] = [];
    for (const server of state.servers) {
      const serverConfigFileName = server.id + ".json";
      await writeTextFile(
        state.settings.data_dir + ServersBaseDir + serverConfigFileName,
        JSON.stringify(server, null, 2),
      );
      serversIndex.push(serverConfigFileName);
    }
    // Write index file
    await writeTextFile(
      state.settings.data_dir + ServersIndexFileName,
      JSON.stringify(serversIndex, null, 2),
    );
  },
);

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
    reorderServer: (state, action) => {
      const moved = state.splice(action.payload.sourceIndex, 1);
      state.splice(action.payload.destinationIndex, 0, ...moved);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readServers.fulfilled, (_, action) => action.payload);
    builder.addCase(saveServers.fulfilled, () => {});
  },
});

export const {
  addServer,
  updateServerByIndex,
  removeServerByIndex,
  reorderServer,
} = serversSlice.actions;

export default serversSlice.reducer;
