import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  exists,
  readTextFile,
  remove,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import type { Server } from "@/types/server.ts";
import type { RootState } from "@/store.ts";
import { checkParentDir } from "@/slices/utils.ts";
import { path } from "@tauri-apps/api";

const ServersIndexFileName = "servers.json";
const ServersBaseDir = "servers";
const ServersFileSuffix = ".json";

const noServer: Server[] = [];

export const readServers = createAsyncThunk(
  "servers/read",
  async (_, { getState }): Promise<Server[]> => {
    const state = getState() as RootState;
    const serversIndexFilePath = await path.join(
      state.settings.current_workspace.data_dir,
      ServersIndexFileName,
    );
    const serversDirectoryPath = await path.join(
      state.settings.current_workspace.data_dir,
      ServersBaseDir,
    );
    if (await exists(serversIndexFilePath)) {
      // Read index file
      const serversIndex = JSON.parse(await readTextFile(serversIndexFilePath));
      // Read detailed server configurations
      const servers: Server[] = [];
      for (const serverConfigFileName of serversIndex) {
        const serverConfigFileNameFull = await path.join(
          serversDirectoryPath,
          serverConfigFileName + ServersFileSuffix,
        );
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
  async (ids: string[], { getState }) => {
    const state: any = getState() as RootState;
    const serversIndexFilePath = await path.join(
      state.settings.current_workspace.data_dir,
      ServersIndexFileName,
    );
    const serversDirectoryPath = await path.join(
      state.settings.current_workspace.data_dir,
      ServersBaseDir,
    );
    await checkParentDir(serversDirectoryPath);
    // Write detailed server configurations
    const serversIndex: string[] = [];
    for (const server of state.servers) {
      if (ids.includes(server.id)) {
        // Requires update
        await writeTextFile(
          await path.join(serversDirectoryPath, server.id + ServersFileSuffix),
          JSON.stringify(server, null, 2),
        );
      }
      serversIndex.push(server.id);
    }
    // Write index file
    await writeTextFile(
      serversIndexFilePath,
      JSON.stringify(serversIndex, null, 2),
    );
  },
);

export const deleteServerFile = createAsyncThunk(
  "servers/delete-server-file",
  async (id: string, { getState }) => {
    const state: any = getState() as RootState;
    const serversDirectoryPath = await path.join(
      state.settings.current_workspace.data_dir,
      ServersBaseDir,
    );
    await remove(await path.join(serversDirectoryPath, id + ServersFileSuffix));
  },
);

export const serversSlice = createSlice({
  name: "servers",
  initialState: noServer,
  reducers: {
    addServer: (state, action: PayloadAction<Server>) => {
      state.push(action.payload);
    },
    updateServerByIndex: (
      state,
      action: PayloadAction<{
        index: number;
        server: Server;
      }>,
    ) => {
      state.splice(action.payload.index, 1, action.payload.server);
    },
    removeServerByIndex: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
    reorderServer: (
      state,
      action: PayloadAction<{
        sourceIndex: number;
        destinationIndex: number;
      }>,
    ) => {
      const moved = state.splice(action.payload.sourceIndex, 1);
      state.splice(action.payload.destinationIndex, 0, ...moved);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      readServers.fulfilled,
      (_, action: PayloadAction<Server[]>) => action.payload,
    );
    builder.addCase(saveServers.fulfilled, () => {});
    builder.addCase(deleteServerFile.fulfilled, () => {});
  },
});

export const {
  addServer,
  updateServerByIndex,
  removeServerByIndex,
  reorderServer,
} = serversSlice.actions;

export default serversSlice.reducer;
