import {
  ActionIcon,
  Box,
  Checkbox,
  Flex,
  Group,
  ScrollArea,
  Table,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconId, IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import type { Server } from "@/types/server.ts";
import type { RootState } from "@/store.ts";
import ServerCardModal from "@/components/ServerCardModal.tsx";
import { searchServers } from "@/search/servers.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";

interface ServerTableHeadProps {
  selectedState: "all" | "partial" | "none";
  selectAll: (state: boolean) => void;
}
const ServerTableHead = ({
  selectedState,
  selectAll,
}: ServerTableHeadProps) => {
  return (
    <Table.Tr>
      <Table.Th>
        <Checkbox
          checked={selectedState === "all"}
          indeterminate={selectedState === "partial"}
          onChange={(event) => selectAll(event.currentTarget.checked)}
        />
      </Table.Th>
      <Table.Th>Server Name</Table.Th>
      <Table.Th>Server ID</Table.Th>
      <Table.Th style={actionRowStyle}>Actions</Table.Th>
    </Table.Tr>
  );
};

interface ServerTableRowProps {
  server: Server;
  show: () => void;
  isSelected: boolean;
  setIsSelected: (state: boolean) => void;
}
const ServerTableRow = ({
  server,
  show,
  isSelected,
  setIsSelected,
}: ServerTableRowProps) => (
  <Table.Tr>
    <Table.Td>
      <Checkbox
        checked={isSelected}
        onChange={(event) => setIsSelected(event.currentTarget.checked)}
      />
    </Table.Td>
    <Table.Td>{server.name}</Table.Td>
    <Table.Td>{server.id}</Table.Td>
    <Table.Td style={actionRowStyle}>
      <Group gap="xs" justify="center">
        <Tooltip label={"Show"} openDelay={500}>
          <ActionIcon color={server.color} onClick={show}>
            <IconId style={actionIconStyle} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Table.Td>
  </Table.Tr>
);

interface ServerTableProps {
  servers: Server[];
  show: (index: number) => void;
  isSearching: boolean;
  selectedServers: number[];
  setSelectedServers: (state: number[]) => void;
}
const ServerTable = ({
  servers,
  show,
  isSearching,
  selectedServers,
  setSelectedServers,
}: ServerTableProps) => (
  <Table stickyHeader stickyHeaderOffset={0} highlightOnHover>
    <Table.Thead
      style={{
        zIndex: 1,
      }}
    >
      <ServerTableHead
        selectAll={(state) => {
          if (state) {
            setSelectedServers(servers.map((_, index) => index));
          } else {
            setSelectedServers([]);
          }
        }}
        selectedState={
          selectedServers.length === 0
            ? "none"
            : selectedServers.length === servers.length
              ? "all"
              : "partial"
        }
      />
    </Table.Thead>
    <Table.Tbody>
      {servers.map((server, index) => (
        <ServerTableRow
          key={server.id}
          server={server}
          show={() => show(index)}
          isSelected={selectedServers.includes(index)}
          setIsSelected={(state) => {
            if (state) {
              if (!selectedServers.includes(index)) {
                setSelectedServers([...selectedServers, index]);
              }
            } else {
              const keyIndex = selectedServers.findIndex((i) => i === index);
              if (keyIndex > -1) {
                setSelectedServers([
                  ...selectedServers.slice(0, keyIndex),
                  ...selectedServers.slice(keyIndex + 1),
                ]);
              }
            }
          }}
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

const MultirunPage = () => {
  const servers = useSelector((state: RootState) => state.servers);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServerIndex, setActiveServerIndex] = useState<number>(-1);
  const [selectedServers, setSelectedServers] = useState<number[]>([]);

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
                onClick={() => {
                  // TODO: Multirun
                  console.log(selectedServers);
                }}
              >
                <IconPlayerPlay style={actionIconStyle} />
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
            isSearching={debouncedSearchInput !== ""}
            selectedServers={selectedServers}
            setSelectedServers={setSelectedServers}
          />
        </ScrollArea>
      </Flex>

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

export default MultirunPage;
