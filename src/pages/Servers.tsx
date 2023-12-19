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
const emptyIndex = -1;

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

  const [activeServerIndex, setActiveServerIndex] =
    useState<number>(emptyIndex);

  // Edit actions
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
    if (activeServerIndex !== emptyIndex) {
      // Edit
      if (newServerInfo.id !== servers[activeServerIndex].id) {
        // Check duplicate ID
        const findDupIDServer = servers.find(
          (server) => server.id === newServerInfo.id,
        );
        if (findDupIDServer !== undefined) {
          // Found
          notifyDupID(findDupIDServer.name);
          return false;
        }
      }

      dispatch(
        updateServerByIndex({
          index: activeServerIndex,
          server: encryptServer(
            encryption,
            newServerInfo,
            servers[activeServerIndex],
          ),
        }),
      );
    } else {
      // Create
      // Check duplicate ID
      const findDupIDServer = servers.find(
        (server) => server.id === newServerInfo.id,
      );
      if (findDupIDServer !== undefined) {
        // Found
        notifyDupID(findDupIDServer.name);
        return false;
      }
      dispatch(addServer(encryptServer(encryption, newServerInfo)));
    }
    dispatch(saveServers([newServerInfo.id]));
    return true;
  };

  const del = (index: number) => {
    dispatch(removeServerByIndex(index));
    dispatch(saveServers([]));
  };

  const reorder = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex !== destinationIndex) {
      dispatch(
        reorderServer({
          sourceIndex,
          destinationIndex,
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
                  setActiveServerIndex(emptyIndex);
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
            show={(index) => {
              setActiveServerIndex(index);
              openServerCardModal();
            }}
            edit={(index) => {
              setActiveServerIndex(index);
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
        serverInfo={
          activeServerIndex === emptyIndex
            ? undefined
            : servers[activeServerIndex]
        }
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
        serverInfo={
          activeServerIndex === emptyIndex
            ? undefined
            : servers[activeServerIndex]
        }
      />
    </>
  );
};

export default ServersPage;
