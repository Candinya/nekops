import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  SettingsSave,
  SettingsState,
  WorkSpace,
} from "@/types/settings.ts";
import { defaultSettings } from "@/types/settings.ts";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { checkParentDir } from "@/slices/utils.ts";
import { path } from "@tauri-apps/api";
import { documentDir } from "@tauri-apps/api/path";
import type { RootState } from "@/store.ts";

const SettingsFileName = "settings.json";

export const readSettings = createAsyncThunk(
  "settings/read",
  async (): Promise<SettingsState> => {
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
        let targetWorkspace: WorkSpace | undefined = undefined;
        if (settingsSaved.current_workspace_id) {
          targetWorkspace = settingsSaved.workspaces.find(
            (w) => w.id === settingsSaved.current_workspace_id,
          );
        }
        if (!targetWorkspace) {
          // Fallback to first workspace
          targetWorkspace = settingsSaved.workspaces[0];
        }
        return {
          workspaces: settingsSaved.workspaces,
          current_workspace: targetWorkspace,
          default_ssh_action: settingsSaved.default_ssh_action,
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
  async (state: SettingsState | undefined, { getState }) => {
    if (state === undefined) {
      state = (getState() as RootState).settings;
    }
    // save to local file
    const parentDir = await path.join(await documentDir(), "nekops");
    const settingsFilePath = await path.join(parentDir, SettingsFileName);
    await checkParentDir(parentDir);
    const settingsSave: SettingsSave = {
      workspaces: state.workspaces,
      current_workspace_id: state.current_workspace.id,
      default_ssh_action: state.default_ssh_action,
    };
    await writeTextFile(settingsFilePath, JSON.stringify(settingsSave));
    return state;
  },
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultSettings,
  reducers: {
    setCurrentWorkspaceByID: (state, action: PayloadAction<string>) => {
      const targetWorkspace = state.workspaces.find(
        (w) => w.id === action.payload,
      );
      if (targetWorkspace !== undefined) {
        state.current_workspace = targetWorkspace;
      } else {
        throw new Error("No such workspace");
      }
    },
    updateWorkspaceByID: (
      state,
      action: PayloadAction<{
        id: string;
        workspace: WorkSpace;
      }>,
    ) => {
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
    builder.addCase(
      readSettings.fulfilled,
      (_, action: PayloadAction<SettingsState>) => {
        return action.payload;
      },
    );
    builder.addCase(saveSettings.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const { setCurrentWorkspaceByID, updateWorkspaceByID } =
  settingsSlice.actions;

export default settingsSlice.reducer;
