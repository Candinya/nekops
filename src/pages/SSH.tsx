import { Box, Flex, rem, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
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

const SSHPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const encryption = useSelector((state: RootState) => state.encryption);

  const startSSH = async (server: Server) => {
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
    const nonce = randomString(8); // TODO

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
            autoClose: 2_000,
          });
          loadingNotify = null;
        }

        // Emit SSH event
        const newSSHEvent: EventNewSSHPayload = {
          server,
        };
        await emit(EventNewSSHName, newSSHEvent);

        // Close listener
        isReadyListenerStopFn();
      },
    );

    // Start check interval
    isReadyChecker = setInterval(() => {
      emit(EventIsSSHWindowReady, nonce);
    }, 1_000);

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
    <Flex direction="column" h="100%">
      <Box p="md">
        <SearchBar
          placeholder="Search servers"
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          debouncedSearchInput={debouncedSearchInput}
        />
      </Box>
      <ScrollArea>
        <Flex px="md" pb="md" direction="column" gap="md">
          {searchServers(debouncedSearchInput, servers).map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onClick={() => startSSH(server)}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SSHPage;
