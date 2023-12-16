import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultSettings, type Settings } from "@/types/settings.ts";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { checkParentDir } from "@/slices/common.ts";

const BaseDir = defaultSettings.data_dir;
const SettingsFileName = BaseDir + "settings.json";

export const readSettings = createAsyncThunk(
  "settings/read",
  async (): Promise<Settings> => {
    // read from local file
    await checkParentDir(BaseDir);
    if (await exists(SettingsFileName)) {
      // Read and parse
      const settingsFile = await readTextFile(SettingsFileName);
      return JSON.parse(settingsFile);
    } else {
      // Initialize file
      await writeTextFile(SettingsFileName, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
  },
);

export const saveSettings = createAsyncThunk(
  "settings/save",
  async (state: Settings) => {
    // save to local file
    await checkParentDir(BaseDir);
    await writeTextFile(SettingsFileName, JSON.stringify(state));
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
