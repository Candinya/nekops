import { ActionIcon, Box, Flex, ScrollArea, Tooltip } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCardModal from "@/components/ServerCardModal.tsx";
import { searchServers } from "@/search/servers.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle } from "@/common/actionStyles.ts";
import ServerTable from "@/components/multirun/ServerTable.tsx";
import { openShellWindow } from "@/utils/openShellWindow.ts";
import type { Server } from "@/types/server.ts";
import { notifications } from "@mantine/notifications";
import { randomString } from "@/utils/randomString.ts";
import { emit, listen } from "@tauri-apps/api/event";
import {
  EventAckSSHWindowReady,
  EventIsSSHWindowReady,
  EventNewSSHName,
} from "@/events/name.ts";
import type { EventNewSSHPayload } from "@/events/payload.ts";
import {
  FailNotification,
  LoadingNotification,
  SuccessNotification,
} from "@/notifications/shell.tsx";

const MultirunPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const serversWithRegularAccess = useMemo(
    () => servers.filter((server) => Boolean(server.access.regular.address)),
    [servers],
  );
  const encryption = useSelector((state: RootState) => state.encryption);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServer, setActiveServer] = useState<Server | null>(null);
  const [selectedServerIDs, setSelectedServerIDs] = useState<string[]>([]);

  const startMultirun = async () => {
    // Create or open Shell window
    await openShellWindow(encryption.isUnlocked); // Disable content protection when unlocked

    // Prepare checker
    let isReadyChecker: ReturnType<typeof setInterval> | null = null;

    // Set notification
    let loadingNotify: string | null = notifications.show(LoadingNotification);

    const newSSHEvent: EventNewSSHPayload = {
      servers: [],
      // code: "", // TODO
    };

    for (const server of servers.filter((s) =>
      selectedServerIDs.includes(s.id),
    )) {
      // Generate random nonce to prevent possible conflict, for server only
      const nonce = randomString(8);
      // Push server info
      newSSHEvent.servers.push({
        nonce,
        name: server.name,
        color: server.color,
        access: {
          ...server.access.regular,
          user: server.access.regular.user || "root", // Default
        },
      });
    }

    // Generate random nonce to prevent possible conflict, for event only
    const msgNonce = randomString(8);

    // Wait till window is ready
    const isReadyListenerStopFn = await listen<string>(
      EventAckSSHWindowReady,
      async (ev) => {
        if (ev.payload !== msgNonce) {
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
        await emit(EventNewSSHName, newSSHEvent);

        // Close listener
        isReadyListenerStopFn();
      },
    );

    // Start check interval
    isReadyChecker = setInterval(() => {
      emit(EventIsSSHWindowReady, msgNonce);
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

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  return (
    <>
      <Flex direction="column" h="100%">
        <Box p="md">
          {/*Search and Create*/}
          <Flex direction="row" justify="space-between" gap="lg">
            <SearchBar
              placeholder="Search servers"
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              debouncedSearchInput={debouncedSearchInput}
            />

            <Tooltip label="Start" openDelay={500}>
              <ActionIcon
                size="lg"
                color="green"
                disabled={selectedServerIDs.length === 0}
                onClick={startMultirun}
              >
                <IconPlayerPlay style={actionIconStyle} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>

        {/*Server Table*/}
        <ScrollArea>
          <ServerTable
            servers={searchServers(
              debouncedSearchInput,
              serversWithRegularAccess,
            )}
            show={(server) => {
              setActiveServer(server);
              openServerCardModal();
            }}
            isSearching={debouncedSearchInput !== ""}
            selectedServerIDs={selectedServerIDs}
            setSelectedServerIDs={setSelectedServerIDs}
          />
        </ScrollArea>
      </Flex>

      {/*Server Card Modal*/}
      <ServerCardModal
        isOpen={isServerCardModalOpen}
        close={closeServerCardModal}
        serverInfo={activeServer}
      />
    </>
  );
};

export default MultirunPage;
