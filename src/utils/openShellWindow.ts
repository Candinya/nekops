import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const ShellWindowLabel = "nekopshell"; // Nekops Shell

/**
 * Open (or create if non-current) Shell Window
 * @param disableContentProtection Disable window content protection (means can be captured by other software)
 */
export const openShellWindow = async (
  disableContentProtection: boolean = false,
) => {
  let shellWindow = WebviewWindow.getByLabel(ShellWindowLabel);
  if (shellWindow === null) {
    // Open new
    shellWindow = new WebviewWindow(ShellWindowLabel, {
      title: "Shell",
      url: "shell.html",
      width: 1200,
      height: 800,
      contentProtected: !disableContentProtection,
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
