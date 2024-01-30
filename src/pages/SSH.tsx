import { Box, Flex } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { openShellWindow } from "@/utils/openShellWindow.ts";
import { emit, listen } from "@tauri-apps/api/event";
import type { EventNewSSHPayload } from "@/events/payload.ts";
import { notifications } from "@mantine/notifications";
import {
  EventAckSSHWindowReady,
  EventIsSSHWindowReady,
  EventNewSSHName,
} from "@/events/name.ts";
import { randomString } from "@/utils/randomString.ts";
import ServerCardsVirtualScroll from "@/components/ServerCardsVirtualScroll.tsx";
import {
  FailNotification,
  LoadingNotification,
  SuccessNotification,
} from "@/notifications/shell.tsx";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

const SSHPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const serversWithRegularAccess = useMemo(
    () => servers.filter((server) => Boolean(server.access.regular.address)),
    [servers],
  );
  const encryption = useSelector((state: RootState) => state.encryption);
  const settings = useSelector((state: RootState) => state.settings);

  const clickServerCard = async (server: Server) => {
    switch (settings.default_ssh_action) {
      case "start":
        startSSHSession(server);
        break;
      case "copy":
      default:
        copySSHCommand(server);
        break;
    }
  };

  const copySSHCommand = async (server: Server) => {
    const command = [
      "ssh",
      `${server.access.regular.user || "root"}@${
        server.access.regular.address
      }`,
    ];
    if (server.access.regular.port !== 22) {
      command.push("-p", `${server.access.regular.port}`);
    }
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

  const startSSHSession = async (server: Server) => {
    // Create or open Shell window
    await openShellWindow(encryption.isUnlocked); // Disable content protection when unlocked

    // Prepare checker
    let isReadyChecker: ReturnType<typeof setInterval> | null = null;

    // Set notification
    let loadingNotify: string | null = notifications.show(LoadingNotification);

    // Generate random nonce to prevent possible conflict, for both server and event
    const nonce = randomString(8);

    // Wait till window is ready
    const isReadyListenerStopFn = await listen<string>(
      EventAckSSHWindowReady,
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
          servers: [
            {
              nonce,
              name: server.name,
              color: server.color,
              access: {
                ...server.access.regular,
                user: server.access.regular.user || "root", // Default
              },
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
      emit(EventIsSSHWindowReady, nonce);
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

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  return (
    <Flex
      direction="column"
      h="100%"
      style={{
        overflow: "hidden",
      }}
    >
      <Box p="md">
        <SearchBar
          placeholder="Search servers"
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          debouncedSearchInput={debouncedSearchInput}
        />
      </Box>
      <ServerCardsVirtualScroll
        servers={searchServers(debouncedSearchInput, serversWithRegularAccess)}
        onClicked={clickServerCard}
      />
    </Flex>
  );
};

export default SSHPage;
