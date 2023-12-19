import {
  ActionIcon,
  Checkbox,
  Group,
  rem,
  Table,
  Tooltip,
} from "@mantine/core";
import { IconId } from "@tabler/icons-react";

import type { Server } from "@/types/server.ts";
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
      <Table.Th style={{ width: rem(40) }}>
        <Checkbox
          checked={selectedState === "all"}
          indeterminate={selectedState === "partial"}
          onChange={(event) => selectAll(event.currentTarget.checked)}
        />
      </Table.Th>
      <Table.Th>Server Name</Table.Th>
      <Table.Th>Server ID</Table.Th>
      <Table.Th>Tags</Table.Th>
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
    <Table.Td>{server.tags.join(", ")}</Table.Td>
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
  selectedServerIDs: string[];
  setSelectedServerIDs: (state: string[]) => void;
}
const ServerTable = ({
  servers,
  show,
  isSearching,
  selectedServerIDs,
  setSelectedServerIDs,
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
            setSelectedServerIDs(servers.map((server) => server.id));
          } else {
            setSelectedServerIDs([]);
          }
        }}
        selectedState={
          selectedServerIDs.length === 0
            ? "none"
            : selectedServerIDs.length === servers.length
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
          isSelected={selectedServerIDs.includes(server.id)}
          setIsSelected={(state) => {
            if (state) {
              if (!selectedServerIDs.includes(server.id)) {
                setSelectedServerIDs([...selectedServerIDs, server.id]);
              }
            } else {
              const keyIndex = selectedServerIDs.findIndex(
                (i) => i === server.id,
              );
              if (keyIndex > -1) {
                setSelectedServerIDs([
                  ...selectedServerIDs.slice(0, keyIndex),
                  ...selectedServerIDs.slice(keyIndex + 1),
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

export default ServerTable;
