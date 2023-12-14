import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import EditServerModal from "@/components/EditServerModal";
import { useState } from "react";
import type { Server } from "@/types/server.ts";
import {
  IconId,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import ServerCard from "@/components/ServerCard.tsx";

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
        <Tooltip label={"Delete"} openDelay={500}>
          <ActionIcon color="red" onClick={del}>
            <IconTrash style={actionIconStyle} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Table.Td>
  </Table.Tr>
);

interface ServerTableProps {
  servers: Server[];
  show: (index: number) => void;
  edit: (index: number) => void;
  del: (index: number) => void;
}
const ServerTable = ({ servers, show, edit, del }: ServerTableProps) => (
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

const Servers = () => {
  const [
    isEditServerModalOpen,
    { open: openEditServerModal, close: closeEditServerModal },
  ] = useDisclosure(false);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServerIndex, setActiveServerIndex] = useState<number>(-1);

  const [servers, setServers] = useState<Server[]>([]);

  const save = (newServerInfo: Server) => {
    if (activeServerIndex !== -1) {
      // Edit
      setServers([
        ...servers.slice(0, activeServerIndex),
        newServerInfo,
        ...servers.slice(activeServerIndex + 1),
      ]);
    } else {
      // Create
      setServers([...servers, newServerInfo]);
    }
  };

  return (
    <>
      <Flex direction="column" h="100%">
        <Box p="md">
          {/*Search and Create*/}
          <Flex direction="row" justify="space-between" gap="lg">
            <TextInput
              leftSection={<IconSearch />}
              placeholder="Search servers"
              style={{
                flexGrow: 1,
              }}
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
            servers={servers}
            show={(index) => {
              setActiveServerIndex(index);
              openServerCardModal();
            }}
            edit={(index) => {
              setActiveServerIndex(index);
              openEditServerModal();
            }}
            del={(index) => {
              setServers([
                ...servers.slice(0, index),
                ...servers.slice(index + 1),
              ]);
            }}
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
        save={save}
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

export default Servers;
