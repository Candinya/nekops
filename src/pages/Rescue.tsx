import {
  ActionIcon,
  Box,
  Flex,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Text,
  Tooltip,
} from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { actionIconStyle } from "@/common/actionStyles.ts";
import type { Server } from "@/types/server.ts";
import { decryptServer } from "@/slices/encryptionSlice.ts";
import { notifications } from "@mantine/notifications";
import UnlockModal from "@/components/UnlockModal.tsx";
import RescueModal from "@/components/rescue/RescueModal.tsx";
import { open } from "@tauri-apps/plugin-shell";

const RescuePage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const encryption = useSelector((state: RootState) => state.encryption);

  const [
    isUnlockModalOpen,
    { open: openUnlockModal, close: closeUnlockModal },
  ] = useDisclosure(false);

  const [
    isRescueModalOpen,
    { open: openRescueModal, close: closeRescueModal },
  ] = useDisclosure(false);

  const [activeServer, setActiveServer] = useState<Server | null>(null);

  const startRescue = (server: Server) => {
    if (!encryption.isUnlocked) {
      // Do nothing
      return;
    }

    setActiveServer(decryptServer(encryption, server));
    openRescueModal();
  };

  const launchRescuePlatform = async () => {
    switch (activeServer?.access.emergency.method) {
      case "VNC":
        notifications.show({
          color: "blue",
          title: "Launch VNC",
          message:
            "You may have to copy Address and handle it with correct VNC tool (like TigerVNC).",
        });
        break;
      case "IPMI":
        try {
          await open(activeServer?.access.emergency.address);
        } catch (e: any) {
          notifications.show({
            color: "red",
            title: "Launch failed",
            message: e.message,
          });
        }
        break;
      default:
        notifications.show({
          color: "blue",
          title: "Launch rescue",
          message:
            "You may have to copy Address and handle it with correct tool.",
        });
        break;
    }
  };

  // Search related
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

            <Tooltip label="Unlock" openDelay={500}>
              <ActionIcon
                size="lg"
                color={encryption.isUnlocked ? "green" : "orange"}
                onClick={() => {
                  if (encryption.isUnlocked) {
                    notifications.show({
                      color: "green",
                      title: "You've already unlocked!",
                      message: "Time to start rescue works XD",
                    });
                  } else {
                    openUnlockModal();
                  }
                }}
              >
                {encryption.isUnlocked ? (
                  <IconLockOpen style={actionIconStyle} />
                ) : (
                  <IconLock style={actionIconStyle} />
                )}
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>
        <ScrollArea h="100%">
          <LoadingOverlay
            visible={!encryption.isUnlocked}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{
              children: (
                <Flex direction="column" align="center" gap="sm">
                  <Loader type="bars" color={"orange"} />
                  <Text>Please unlock first...</Text>
                </Flex>
              ),
            }}
            zIndex={1}
            style={{
              cursor: "pointer",
            }}
            onClick={openUnlockModal}
          />
          <Flex px="md" pb="md" direction="column" gap="md">
            {searchServers(debouncedSearchInput, servers).map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onClick={() => startRescue(server)}
              />
            ))}
          </Flex>
        </ScrollArea>
      </Flex>

      <UnlockModal
        isOpen={isUnlockModalOpen}
        close={closeUnlockModal}
        successMessage="Time to start rescue works XD"
      />

      <RescueModal
        isOpen={isRescueModalOpen}
        close={closeRescueModal}
        server={activeServer}
        launch={launchRescuePlatform}
      />
    </>
  );
};

export default RescuePage;
