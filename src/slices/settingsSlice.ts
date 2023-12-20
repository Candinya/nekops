import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultSettings, type Settings } from "@/types/settings.ts";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { checkParentDir } from "@/slices/common.ts";
import { path } from "@tauri-apps/api";

const SettingsFileName = "settings.json";

export const readSettings = createAsyncThunk(
  "settings/read",
  async (): Promise<Settings> => {
    // read from local file
    const settingsFilePath = await path.join(
      defaultSettings.data_dir,
      SettingsFileName,
    );
    await checkParentDir(defaultSettings.data_dir);
    if (await exists(settingsFilePath)) {
      // Read and parse
      const settingsFile = await readTextFile(settingsFilePath);
      return JSON.parse(settingsFile);
    } else {
      // Initialize file
      await writeTextFile(settingsFilePath, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
  },
);

export const saveSettings = createAsyncThunk(
  "settings/save",
  async (state: Settings) => {
    // save to local file
    const settingsFilePath = await path.join(
      defaultSettings.data_dir,
      SettingsFileName,
    );
    await checkParentDir(defaultSettings.data_dir);
    await writeTextFile(settingsFilePath, JSON.stringify(state));
    await checkParentDir(state.data_dir);
    return state;
  },
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultSettings,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(readSettings.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(saveSettings.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const {} = settingsSlice.actions;

export default settingsSlice.reducer;
