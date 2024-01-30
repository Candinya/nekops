export type WorkSpace = {
  id: string;
  name: string;
  data_dir: string;
};

type SettingsCommon = {
  workspaces: WorkSpace[];
  default_ssh_action: "copy" | "start";
};

export type SettingsSave = {
  current_workspace_id: string;
} & SettingsCommon;

export type SettingsState = {
  current_workspace: WorkSpace;
} & SettingsCommon;

export const defaultWorkspace: WorkSpace = {
  id: "default",
  name: "Default",
  data_dir: "nekops_data",
};

export const defaultSettings: SettingsState = {
  workspaces: [defaultWorkspace],
  current_workspace: defaultWorkspace,
  default_ssh_action: "copy",
};
