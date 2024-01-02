export type WorkSpace = {
  id: string;
  name: string;
  data_dir: string;
};

export type SettingsSave = {
  workspaces: WorkSpace[];
  currentWorkspaceID: string;
};

export type Settings = {
  workspaces: WorkSpace[];
  currentWorkspace: WorkSpace;
};

export const defaultWorkspace: WorkSpace = {
  id: "default",
  name: "Default",
  data_dir: "nekops_data",
};

export const defaultSettings: Settings = {
  workspaces: [defaultWorkspace],
  currentWorkspace: defaultWorkspace,
};
