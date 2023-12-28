import { Box, Flex, LoadingOverlay, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { decryptServer } from "@/slices/encryptionSlice.ts";
import { notifications } from "@mantine/notifications";
import UnlockModal from "@/components/UnlockModal.tsx";
import RescueModal from "@/components/rescue/RescueModal.tsx";
import { open } from "@tauri-apps/plugin-shell";
import ServerCardsVirtualScroll from "@/components/ServerCardsVirtualScroll.tsx";
import { IconLock } from "@tabler/icons-react";

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
      <Flex
        direction="column"
        h="100%"
        pos="relative"
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
        <LoadingOverlay
          visible={!encryption.isUnlocked}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{
            children: (
              <Flex direction="column" align="center" gap="sm">
                {/*<Loader type="bars" color={"orange"} />*/}
                <IconLock size={60} />
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
        <ServerCardsVirtualScroll
          servers={searchServers(debouncedSearchInput, servers)}
          onClicked={startRescue}
        />
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
