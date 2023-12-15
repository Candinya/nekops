export type Settings = {
  data_dir: string;
  color_scheme: "auto" | "light" | "dark";
};

export const defaultSettings: Settings = {
  data_dir: "nekops_data/",
  color_scheme: "auto",
};