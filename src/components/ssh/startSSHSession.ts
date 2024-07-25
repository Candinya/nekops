import type { Server } from "@/types/server.ts";
import { openShellWindow } from "@/utils/openShellWindow.ts";
import { emit, listen } from "@tauri-apps/api/event";
import type { EventNewSSHPayload } from "@/events/payload.ts";
import { notifications } from "@mantine/notifications";
import {
  EventNewSSHName,
  EventRequestSSHWindowReadyName,
  EventResponseSSHWindowReadyName,
} from "@/events/name.ts";
import { randomString } from "@/utils/randomString.ts";
import {
  FailNotification,
  LoadingNotification,
  SuccessNotification,
} from "@/notifications/shell.tsx";

export const startSSHSession = async (
  server: Server,
  disableContentProtection: boolean,
  jumpServer?: Server,
) => {
  // Create or open Shell window
  await openShellWindow(disableContentProtection); // Disable content protection when unlocked

  // Prepare checker
  let isReadyChecker: ReturnType<typeof setInterval> | null = null;

  // Set notification
  let loadingNotify: string | null = notifications.show(LoadingNotification);

  // Generate random nonce to prevent possible conflict, for both server and event
  const nonce = randomString(8);

  // Wait till window is ready
  const isReadyListenerStopFn = await listen<string>(
    EventResponseSSHWindowReadyName,
    async (ev) => {
      if (ev.payload !== nonce) {
        // Not for this session
        return;
      }

      // Stop checker
      if (isReadyChecker) {
        clearInterval(isReadyChecker);
      }

      // Update notification
      if (loadingNotify) {
        notifications.update({
          ...SuccessNotification,
          id: loadingNotify,
        });
        loadingNotify = null;
      }

      // Emit SSH event
      const newSSHEvent: EventNewSSHPayload = {
        server: [
          {
            nonce,
            name: server.name,
            color: server.color,
            access: server.access.regular,
            jumpServer: jumpServer ? jumpServer.access.regular : undefined,
          },
        ],
      };
      await emit(EventNewSSHName, newSSHEvent);

      // Close listener
      isReadyListenerStopFn();
    },
  );

  // Start check interval
  isReadyChecker = setInterval(() => {
    emit(EventRequestSSHWindowReadyName, nonce);
  }, 200);

  // Set timeout notice
  setTimeout(() => {
    if (loadingNotify) {
      // Still loading
      notifications.update({
        ...FailNotification,
        id: loadingNotify,
      });
    }
  }, 10_000); // 10 seconds
};
