import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const ShellWindowLabel = "nekopshell"; // Nekops Shell

/**
 * Open (or create if non-current) Shell Window
 */
export const openShellWindow = async () => {
  let shellWindow = WebviewWindow.getByLabel(ShellWindowLabel);
  if (shellWindow === null) {
    // Open new
    shellWindow = new WebviewWindow(ShellWindowLabel, {
      title: "Shell",
      url: "shell.html",
      width: 1200,
      height: 800,
      decorations: false,
    });
  } else {
    // Bring back to focus
    if (await shellWindow.isMinimized()) {
      await shellWindow.unminimize();
    }
    if (!(await shellWindow.isFocused())) {
      await shellWindow.setFocus();
    }
  }
  return shellWindow;
};
