import { createDir, exists } from "@tauri-apps/plugin-fs";

export const checkParentDir = async (dirname: string) => {
  if (!(await exists(dirname))) {
    await createDir(dirname, {
      recursive: true,
    });
  }
};
