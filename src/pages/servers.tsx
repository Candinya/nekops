import {
  ActionIcon,
  Box,
  CloseButton,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconId, IconPencil, IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Server } from "@/types/server.ts";
import EditServerModal from "@/components/EditServerModal";
import ServerCard from "@/components/ServerCard.tsx";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  addServer,
  removeServerByIndex,
  saveServers,
  updateServerByIndex,
} from "@/slices/serversSlice.ts";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";

const actionIconStyle = { width: "70%", height: "70%" };

const actionRowStyle = {
  width: "calc(8rem * var(--mantine-scale))",
};

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
      <Group gap="xs">
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

interface ServerCardModalProps {
  isOpen: boolean;
  close: () => void;
  serverInfo?: Server;
}
const ServerCardModal = ({
  isOpen,
  close,
  serverInfo,
}: ServerCardModalProps) => (
  <Modal
    title="Server Card"
    size="lg"
    radius="md"
    opened={isOpen}
    onClose={close}
    centered
    scrollAreaComponent={ScrollArea.Autosize}
  >
    {serverInfo && <ServerCard server={serverInfo} />}
    {serverInfo?.note && (
      <Paper mt="md" shadow="xs" p="xl" radius="md" withBorder>
        <Text
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {serverInfo.note}
        </Text>
      </Paper>
    )}
  </Modal>
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

  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearchKey] = useDebouncedValue(searchKey, 500);

  return (
    <>
      <Flex direction="column" h="100%">
        <Box p="md">
          {/*Search and Create*/}
          <Flex direction="row" justify="space-between" gap="lg">
            <TextInput
              leftSection={<IconSearch size={18} />}
              rightSection={
                searchKey !== "" &&
                (debouncedSearchKey !== searchKey ? (
                  <Loader size="xs" />
                ) : (
                  <CloseButton onClick={() => setSearchKey("")} />
                ))
              }
              placeholder="Search servers"
              style={{
                flexGrow: 1,
              }}
              value={searchKey}
              onChange={(ev) => setSearchKey(ev.currentTarget.value)}
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
            servers={
              debouncedSearchKey === ""
                ? servers
                : servers.filter((server) => {
                    for (const key of debouncedSearchKey.split(/\s+/)) {
                      if (
                        key.length > 0 &&
                        (server.id.includes(key) ||
                          server.name.includes(key) ||
                          server.note.includes(key) ||
                          server.tags.includes(key)) // Tag full match
                      ) {
                        return true;
                      }
                    }
                    return false;
                  })
            }
            show={(index) => {
              setActiveServerIndex(index);
              openServerCardModal();
            }}
            edit={(index) => {
              setActiveServerIndex(index);
              openEditServerModal();
            }}
            del={del}
            isSearching={debouncedSearchKey !== ""}
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
