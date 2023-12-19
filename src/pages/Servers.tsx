import {
  ActionIcon,
  Box,
  Flex,
  Group,
  rem,
  ScrollArea,
  Table,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconGripVertical,
  IconId,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
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
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import ServerCardModal from "@/components/ServerCardModal.tsx";
import { searchServers } from "@/search/servers.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";
import { encryptServer } from "@/slices/encryptionSlice.ts";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const ServerTableHead = () => (
  <Table.Tr>
    <Table.Th style={{ width: rem(40) }} />
    <Table.Th>Server Name</Table.Th>
    <Table.Th>Server ID</Table.Th>
    <Table.Th>Tags</Table.Th>
    <Table.Th style={actionRowStyle}>Actions</Table.Th>
  </Table.Tr>
);

interface ServerTableRowProps {
  index: number;
  server: Server;
  show: () => void;
  edit: () => void;
  del: () => void;
}
const ServerTableRow = ({
  index,
  server,
  show,
  edit,
  del,
}: ServerTableRowProps) => (
  <Draggable draggableId={server.id} index={index}>
    {(provided) => (
      <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
        <Table.Td>
          <Flex
            style={{
              cursor: "grab",
            }}
            {...provided.dragHandleProps}
          >
            <IconGripVertical
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </Flex>
        </Table.Td>
        <Table.Td>{server.name}</Table.Td>
        <Table.Td>{server.id}</Table.Td>
        <Table.Td>{server.tags.join(", ")}</Table.Td>
        <Table.Td style={actionRowStyle}>
          <Group gap="xs" justify="center">
            {/*Show Card*/}
            <Tooltip label={"Show"} openDelay={500}>
              <ActionIcon color={server.color} onClick={show}>
                <IconId style={actionIconStyle} />
              </ActionIcon>
            </Tooltip>

            {/*Edit*/}
            <Tooltip label={"Edit"} openDelay={500}>
              <ActionIcon onClick={edit}>
                <IconPencil style={actionIconStyle} />
              </ActionIcon>
            </Tooltip>

            {/*Delete*/}
            <DeleteItemButton
              itemName={`Server ${server.name}`}
              iconStyle={actionIconStyle}
              onClick={del}
            />
          </Group>
        </Table.Td>
      </Table.Tr>
    )}
  </Draggable>
);

interface ServerTableProps {
  servers: Server[];
  show: (index: number) => void;
  edit: (index: number) => void;
  del: (index: number) => void;
  reorder: (sourceIndex: number, destinationIndex: number) => void;
  isSearching: boolean;
}
const ServerTable = ({
  servers,
  show,
  edit,
  del,
  reorder,
  isSearching,
}: ServerTableProps) => (
  <DragDropContext
    onDragEnd={({ destination, source }) => {
      reorder(source.index, destination?.index || 0);
    }}
  >
    <Table stickyHeader stickyHeaderOffset={0} highlightOnHover>
      <Table.Thead
        style={{
          zIndex: 1,
        }}
      >
        <ServerTableHead />
      </Table.Thead>
      <Droppable droppableId="servers-list" direction="vertical">
        {(provided) => (
          <Table.Tbody ref={provided.innerRef} {...provided.droppableProps}>
            {servers.map((server, index) => (
              <ServerTableRow
                key={server.id}
                index={index}
                server={server}
                show={() => show(index)}
                edit={() => edit(index)}
                del={() => del(index)}
              />
            ))}
            {provided.placeholder}
          </Table.Tbody>
        )}
      </Droppable>
      <Table.Caption>
        {servers.length > 0
          ? `Total ${servers.length} servers.`
          : isSearching
            ? "No matching results."
            : "Let's add first server!"}
      </Table.Caption>
    </Table>
  </DragDropContext>
);

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
  const confirm = (newServerInfo: Server) => {
    if (activeServerIndex !== emptyIndex) {
      // Edit
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
      dispatch(addServer(encryptServer(encryption, newServerInfo)));
    }
    dispatch(saveServers());
  };

  const del = (index: number) => {
    dispatch(removeServerByIndex(index));
    dispatch(saveServers());
  };

  const reorder = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex !== destinationIndex) {
      dispatch(
        reorderServer({
          sourceIndex,
          destinationIndex,
        }),
      );
      dispatch(saveServers());
    }
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  // Autofill related
  const knownProviders = useRef<string[]>([]);
  const knownRegions = useRef<string[]>([]);
  const knownSSHUsers = useRef<string[]>([]);

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
