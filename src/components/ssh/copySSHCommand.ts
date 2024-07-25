import type { Server } from "@/types/server.ts";
import { notifications } from "@mantine/notifications";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

export const copySSHCommand = async (server: Server, jumpServer?: Server) => {
  const command = ["ssh"];
  if (jumpServer) {
    command.push(
      "-J",
      `${jumpServer.access.regular.user || "root"}@${
        jumpServer.access.regular.address
      }` +
        (jumpServer.access.regular.port !== 22
          ? `:${jumpServer.access.regular.port}`
          : ""),
    );
  }
  if (server.access.regular.port !== 22) {
    command.push("-p", `${server.access.regular.port}`);
  }
  command.push(
    `${server.access.regular.user || "root"}@${server.access.regular.address}`,
  );
  try {
    await writeText(command.join(" "));
    notifications.show({
      color: "green",
      title: "SSH command copied!",
      message: "Paste into your favorite shell and let's start!",
    });
  } catch (e) {
    notifications.show({
      color: "red",
      title: "Failed to copy...",
      message: "Maybe let the server's id to remind of something?",
    });
  }
};
