import {
  ActionIcon,
  Box,
  Flex,
  Group,
  ScrollArea,
  Table,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconId, IconPencil, IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Server } from "@/types/server.ts";
import EditServerModal from "@/components/EditServerModal";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  addServer,
  removeServerByIndex,
  saveServers,
  updateServerByIndex,
} from "@/slices/serversSlice.ts";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import ServerCardModal from "@/components/ServerCardModal.tsx";
import { searchServers } from "@/search/servers.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";

const ServerTableHead = () => (
  <Table.Tr>
    <Table.Th>#</Table.Th>
    <Table.Th>Server Name</Table.Th>
    <Table.Th>Server ID</Table.Th>
    <Table.Th style={actionRowStyle}>Actions</Table.Th>
  </Table.Tr>
);

interface ServerTableRowProps {
  no: number;
  server: Server;
  show: () => void;
  edit: () => void;
  del: () => void;
}
const ServerTableRow = ({
  no,
  server,
  show,
  edit,
  del,
}: ServerTableRowProps) => (
  <Table.Tr>
    <Table.Td>{no}</Table.Td>
    <Table.Td>{server.name}</Table.Td>
    <Table.Td>{server.id}</Table.Td>
    <Table.Td style={actionRowStyle}>
      <Group gap="xs" justify="center">
        <Tooltip label={"Show"} openDelay={500}>
          <ActionIcon color={server.color} onClick={show}>
            <IconId style={actionIconStyle} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={"Edit"} openDelay={500}>
          <ActionIcon onClick={edit}>
            <IconPencil style={actionIconStyle} />
          </ActionIcon>
        </Tooltip>
        <DeleteItemButton
          itemName={`Server ${server.name}`}
          iconStyle={actionIconStyle}
          onClick={del}
        />
      </Group>
    </Table.Td>
  </Table.Tr>
);

interface ServerTableProps {
  servers: Server[];
  show: (index: number) => void;
  edit: (index: number) => void;
  del: (index: number) => void;
  isSearching: boolean;
}
const ServerTable = ({
  servers,
  show,
  edit,
  del,
  isSearching,
}: ServerTableProps) => (
  <Table stickyHeader stickyHeaderOffset={0} highlightOnHover>
    <Table.Thead
      style={{
        zIndex: 1,
      }}
    >
      <ServerTableHead />
    </Table.Thead>
    <Table.Tbody>
      {servers.map((server, index) => (
        <ServerTableRow
          key={server.id}
          no={index + 1}
          server={server}
          show={() => show(index)}
          edit={() => edit(index)}
          del={() => del(index)}
        />
      ))}
    </Table.Tbody>
    <Table.Caption>
      {servers.length > 0
        ? `Total ${servers.length} servers.`
        : isSearching
          ? "No matching results."
          : "Let's add first server!"}
    </Table.Caption>
  </Table>
);

const ServersPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const dispatch = useDispatch<AppDispatch>();

  const [
    isEditServerModalOpen,
    { open: openEditServerModal, close: closeEditServerModal },
  ] = useDisclosure(false);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServerIndex, setActiveServerIndex] = useState<number>(-1);

  // Edit actions
  const confirm = (newServerInfo: Server) => {
    if (activeServerIndex !== -1) {
      // Edit
      dispatch(
        updateServerByIndex({
          index: activeServerIndex,
          server: newServerInfo,
        }),
      );
    } else {
      // Create
      dispatch(addServer(newServerInfo));
    }
    dispatch(saveServers());
  };

  const del = (index: number) => {
    dispatch(removeServerByIndex(index));
    dispatch(saveServers());
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  // Autofill related
  const knownProviders = useRef<string[]>([]);
  const knownRegions = useRef<string[]>([]);

  useEffect(() => {
    for (const server of servers) {
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

            <Group gap="xs">
              <ActionIcon
                size="lg"
                color="green"
                onClick={() => {
                  setActiveServerIndex(-1);
                  openEditServerModal();
                }}
              >
                <IconPlus style={actionIconStyle} />
              </ActionIcon>
            </Group>
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
            isSearching={debouncedSearchInput !== ""}
          />
        </ScrollArea>
      </Flex>

      {/*Edit Modal*/}
      <EditServerModal
        isOpen={isEditServerModalOpen}
        close={closeEditServerModal}
        serverInfo={
          activeServerIndex === -1 ? undefined : servers[activeServerIndex]
        }
        save={confirm}
        knownProviders={knownProviders.current}
        knownRegions={knownRegions.current}
      />

      {/*Server Card Modal*/}
      <ServerCardModal
        isOpen={isServerCardModalOpen}
        close={closeServerCardModal}
        serverInfo={
          activeServerIndex === -1 ? undefined : servers[activeServerIndex]
        }
      />
    </>
  );
};

export default ServersPage;
