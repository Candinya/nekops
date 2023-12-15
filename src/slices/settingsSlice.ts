import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultSettings, type Settings } from "@/types/settings.ts";
import {
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

const SettingsFileName = defaultSettings.data_dir + "settings.json";

const checkParentDir = async () => {
  if (!(await exists(defaultSettings.data_dir))) {
    await createDir(defaultSettings.data_dir);
  }
};

export const readSettings = createAsyncThunk(
  "settings/read",
  async (): Promise<Settings> => {
    // read from local file
    await checkParentDir();
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
    await checkParentDir();
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
