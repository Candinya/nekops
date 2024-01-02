import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  defaultSettings,
  type Settings,
  SettingsSave,
} from "@/types/settings.ts";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { checkParentDir } from "@/slices/common.ts";
import { path } from "@tauri-apps/api";
import { documentDir } from "@tauri-apps/api/path";
import type { RootState } from "@/store.ts";

const SettingsFileName = "settings.json";

export const readSettings = createAsyncThunk(
  "settings/read",
  async (): Promise<Settings> => {
    // read from local file
    const parentDir = await path.join(await documentDir(), "nekops");
    const settingsFilePath = await path.join(parentDir, SettingsFileName);
    await checkParentDir(parentDir);
    if (await exists(settingsFilePath)) {
      // Read and parse
      const settingsFile = await readTextFile(settingsFilePath);
      const settingsSaved: SettingsSave = JSON.parse(settingsFile);
      if (settingsSaved.workspaces.length > 0) {
        // Find current active workspace
        const targetWorkspace = settingsSaved.workspaces.find(
          (w) => w.id === settingsSaved.currentWorkspaceID,
        );
        return {
          workspaces: settingsSaved.workspaces,
          currentWorkspace: targetWorkspace || settingsSaved.workspaces[0],
        };
      } else {
        return defaultSettings;
      }
    } else {
      // Initialize file
      const initSettings = structuredClone(defaultSettings);
      initSettings.workspaces[0].data_dir = await path.join(parentDir, "data");
      await writeTextFile(settingsFilePath, JSON.stringify(initSettings));
      return initSettings;
    }
  },
);

export const saveSettings = createAsyncThunk(
  "settings/save",
  async (state: Settings | undefined, { getState }) => {
    if (state === undefined) {
      state = (getState() as RootState).settings;
    }
    // save to local file
    const parentDir = await path.join(await documentDir(), "nekops");
    const settingsFilePath = await path.join(parentDir, SettingsFileName);
    await checkParentDir(parentDir);
    const settingsSave: SettingsSave = {
      workspaces: state.workspaces,
      currentWorkspaceID: state.currentWorkspace.id,
    };
    await writeTextFile(settingsFilePath, JSON.stringify(settingsSave));
    return state;
  },
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultSettings,
  reducers: {
    setCurrentWorkspaceByID: (state, action) => {
      const targetWorkspace = state.workspaces.find(
        (w) => w.id === action.payload,
      );
      if (targetWorkspace !== undefined) {
        state.currentWorkspace = targetWorkspace;
      } else {
        throw new Error("No such workspace");
      }
    },
    updateWorkspaceByID: (state, action) => {
      const { id, workspace } = action.payload;
      const targetWorkspaceIndex = state.workspaces.findIndex(
        (w) => w.id === id,
      );
      if (targetWorkspaceIndex > -1) {
        state.workspaces.splice(targetWorkspaceIndex, 1, workspace);
      } else {
        throw new Error("No such workspace");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readSettings.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(saveSettings.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const { setCurrentWorkspaceByID, updateWorkspaceByID } =
  settingsSlice.actions;

export default settingsSlice.reducer;
