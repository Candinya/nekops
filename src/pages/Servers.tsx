import {
  ActionIcon,
  Box,
  Code,
  Flex,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Server } from "@/types/server.ts";
import EditServerModal from "@/components/EditServerModal";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  addServer,
  removeServerByIndex,
  reorderServer,
  saveServers,
  updateServerByIndex,
} from "@/slices/serversSlice.ts";
import ServerCardModal from "@/components/ServerCardModal.tsx";
import { searchServers } from "@/search/servers.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle } from "@/common/actionStyles.ts";
import { encryptServer } from "@/slices/encryptionSlice.ts";
import { notifications } from "@mantine/notifications";
import ServerTable from "@/components/servers/ServerTable.tsx";

// const passwordUnchanged = "keep-unchanged";

const ServersPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const encryption = useSelector((state: RootState) => state.encryption);
  const dispatch = useDispatch<AppDispatch>();

  const [
    isEditServerModalOpen,
    { open: openEditServerModal, close: closeEditServerModal },
  ] = useDisclosure(false);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServer, setActiveServer] = useState<Server | null>(null);

  const notifyDupID = (dupServerName: string) => {
    notifications.show({
      color: "yellow",
      title: "Duplicate ID found",
      message: (
        <>
          Specified ID is conflict with server <Code>{dupServerName}</Code>.
        </>
      ),
    });
  };

  const confirm = (newServerInfo: Server): boolean => {
    // Check duplicate ID
    if (activeServer === null || newServerInfo.id !== activeServer.id) {
      const findServerByID = servers.find(
        (server) => server.id === newServerInfo.id,
      );
      if (findServerByID !== undefined) {
        // Found
        notifyDupID(findServerByID.name);
        return false;
      }
    }

    if (activeServer !== null) {
      // Edit
      dispatch(
        updateServerByIndex({
          index: servers.findIndex((server) => server.id === activeServer.id),
          server: encryptServer(encryption, newServerInfo, activeServer),
        }),
      );
    } else {
      // Create
      dispatch(addServer(encryptServer(encryption, newServerInfo)));
    }
    dispatch(saveServers([newServerInfo.id]));
    return true;
  };

  const del = (server: Server) => {
    dispatch(removeServerByIndex(servers.findIndex((s) => s.id === server.id)));
    dispatch(saveServers([]));
  };

  const reorder = (sourceServerID: string, destinationServerID: string) => {
    if (sourceServerID !== destinationServerID) {
      dispatch(
        reorderServer({
          sourceIndex: servers.findIndex((s) => s.id === sourceServerID),
          destinationIndex: servers.findIndex(
            (s) => s.id === destinationServerID,
          ),
        }),
      );
      dispatch(saveServers([]));
    }
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  // Autofill related
  const knownTags = useRef<string[]>([]);
  const knownProviders = useRef<string[]>([]);
  const knownRegions = useRef<string[]>([]);
  const knownSSHUsers = useRef<string[]>([]);

  useEffect(() => {
    for (const server of servers) {
      for (const tag of server.tags) {
        if (!knownTags.current.includes(tag)) {
          knownTags.current.push(tag);
        }
      }
      if (
        server.provider.name !== "" &&
        !knownProviders.current.includes(server.provider.name)
      ) {
        knownProviders.current.push(server.provider.name);
      }
      if (
        server.location.region !== "" &&
        !knownRegions.current.includes(server.location.region)
      ) {
        knownRegions.current.push(server.location.region);
      }
      if (
        server.access.regular.user !== "" &&
        !knownSSHUsers.current.includes(server.access.regular.user)
      ) {
        knownSSHUsers.current.push(server.access.regular.user);
      }
    }
  }, [servers]);

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

            <Tooltip label="New server" openDelay={500}>
              <ActionIcon
                size="lg"
                color="green"
                onClick={() => {
                  setActiveServer(null);
                  openEditServerModal();
                }}
              >
                <IconPlus style={actionIconStyle} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>

        {/*Server Table*/}
        <ScrollArea>
          <ServerTable
            servers={searchServers(debouncedSearchInput, servers)}
            show={(server) => {
              setActiveServer(server);
              openServerCardModal();
            }}
            edit={(server) => {
              setActiveServer(server);
              openEditServerModal();
            }}
            del={del}
            reorder={reorder}
            isSearching={debouncedSearchInput !== ""}
          />
        </ScrollArea>
      </Flex>

      {/*Edit Modal*/}
      <EditServerModal
        isOpen={isEditServerModalOpen}
        close={closeEditServerModal}
        serverInfo={activeServer}
        save={confirm}
        knownTags={knownTags.current}
        knownProviders={knownProviders.current}
        knownRegions={knownRegions.current}
        knownSSHUsers={knownSSHUsers.current}
      />

      {/*Server Card Modal*/}
      <ServerCardModal
        isOpen={isServerCardModalOpen}
        close={closeServerCardModal}
        serverInfo={activeServer}
      />
    </>
  );
};

export default ServersPage;
