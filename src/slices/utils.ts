import { exists, mkdir } from "@tauri-apps/plugin-fs";

export const checkParentDir = async (dirname: string) => {
  if (!(await exists(dirname))) {
    await mkdir(dirname, {
      recursive: true,
    });
  }
};
