import { Box, Flex, rem } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { openShellWindow } from "@/utils/openShellWindow.ts";
import { emit, listen } from "@tauri-apps/api/event";
import type { EventNewSSHPayload } from "@/events/payload.ts";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import {
  EventAckSSHWindowReady,
  EventIsSSHWindowReady,
  EventNewSSHName,
} from "@/events/name.ts";
import { randomString } from "@/utils/randomString.ts";
import ServerCardsVirtualScroll from "@/components/ServerCardsVirtualScroll.tsx";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

const SSHPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const encryption = useSelector((state: RootState) => state.encryption);

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

  const startSSH = async (server: Server) => {
    return copySSHCommand(server); // Disable shell before binding is ready

    // Create or open Shell window
    await openShellWindow(encryption.isUnlocked); // Disable content protection when unlocked

    // Prepare checker
    let isReadyChecker: ReturnType<typeof setInterval> | null = null;

    // Set notification
    let loadingNotify: string | null = notifications.show({
      color: "blue",
      loading: true,
      title: "Preparing shell...",
      message:
        "This shouldn't take too long... Or at least it's designed to be quick.",
      autoClose: false,
      withCloseButton: false,
    });

    // Generate random nonce to prevent possible conflict
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
            id: loadingNotify,
            color: "teal",
            title: "Prepare finished!",
            message: "Enjoy your journey~",
            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
            loading: false,
            autoClose: 4_000,
          });
          loadingNotify = null;
        }

        // Emit SSH event
        const newSSHEvent: EventNewSSHPayload = {
          nonce,
          name: server.name,
          color: server.color,
          access: {
            ...server.access.regular,
            user: server.access.regular.user || "root", // Default
          },
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
          id: loadingNotify,
          color: "red",
          message:
            "It shouldn't take so long. If it's still not responding, you may need to restart the shell window, or even the whole program.",
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
        servers={searchServers(debouncedSearchInput, servers)}
        onClicked={startSSH}
      />
    </Flex>
  );
};

export default SSHPage;
