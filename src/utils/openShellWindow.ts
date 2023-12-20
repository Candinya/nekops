import { Window } from "@tauri-apps/api/window";

const ShellWindowLabel = "nekopShell"; // Nekops Shell
export const openShellWindow = async () => {
  let shellWindow = Window.getByLabel(ShellWindowLabel);
  if (shellWindow === null) {
    // Open new
    shellWindow = new Window(ShellWindowLabel, {
      title: "Shell",
      url: "shell.html",
      width: 1200,
      height: 800,
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
