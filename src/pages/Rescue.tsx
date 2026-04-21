import { Box, Flex, LoadingOverlay, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { open } from "@tauri-apps/plugin-shell";
import { IconLock } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import type { RootState } from "@/store.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { decryptServer } from "@/slices/encryptionSlice.ts";
import UnlockModal from "@/components/UnlockModal.tsx";
import RescueModal from "@/components/rescue/RescueModal";
import ServerCardsVirtualScroll from "@/components/ServerCardsVirtualScroll";

const RescuePage = () => {
  const { t } = useTranslation("main", { keyPrefix: "rescue" });

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

  const launchRescuePlatform = async (server: Server) => {
    switch (server.access.emergency.method) {
      case "IPMI":
        try {
          await open(server.access.emergency.address);
        } catch (e: any) {
          notifications.show({
            color: "red",
            title: t("notificationLaunchIPMIFailed"),
            message: e.message,
          });
        }
        break;
      default:
        notifications.show({
          color: "blue",
          title: t("notificationLaunchOtherTitle"),
          message: t("notificationLaunchOtherMessage"),
        });
        break;
    }
  };

  const launchActiveServer = async () => {
    if (activeServer) {
      launchRescuePlatform(activeServer);
    }
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");

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
            placeholder="searchServers"
            setSearchInput={setSearchInput}
            isAutoFocus={encryption.isUnlocked} // Only get autofocus when unlocked
          />
        </Box>

        <Box
          pos="relative"
          h={0}
          style={{
            flexGrow: 1,
          }}
        >
          <LoadingOverlay
            visible={!encryption.isUnlocked}
            overlayProps={{ blur: 2 }}
            loaderProps={{
              children: (
                <Flex direction="column" align="center" gap="sm">
                  {/*<Loader type="bars" color={"orange"} />*/}
                  <IconLock size={60} />
                  <Text>{t("pendingUnlockNotice")}</Text>
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
            servers={searchServers(searchInput, servers)}
            onClick={startRescue}
          />
        </Box>
      </Flex>

      <UnlockModal
        isOpen={isUnlockModalOpen}
        close={closeUnlockModal}
        successMessage={t("unlockSuccessMessage")}
      />

      <RescueModal
        isOpen={isRescueModalOpen}
        close={closeRescueModal}
        server={activeServer}
        launch={launchActiveServer}
      />
    </>
  );
};

export default RescuePage;
