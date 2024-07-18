import {
  ActionIcon,
  Checkbox,
  Group,
  rem,
  Table,
  Tooltip,
} from "@mantine/core";
import { IconClick } from "@tabler/icons-react";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";
import type { SSHSingleServer } from "@/events/payload.ts";

interface TabsTableHeadProps {
  selectedState: "all" | "partial" | "none";
  selectAll: (state: boolean) => void;
}
const TabsTableHead = ({ selectedState, selectAll }: TabsTableHeadProps) => {
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
      <Table.Th style={actionRowStyle(1)}>Show</Table.Th>
    </Table.Tr>
  );
};

interface TabsTableRowProps {
  tab: SSHSingleServer;
  show: () => void;
  isSelected: boolean;
  setIsSelected: (state: boolean) => void;
}
const TabsTableRow = ({
  tab,
  show,
  isSelected,
  setIsSelected,
}: TabsTableRowProps) => (
  <Table.Tr>
    <Table.Td>
      <Checkbox
        checked={isSelected}
        onChange={(event) => setIsSelected(event.currentTarget.checked)}
      />
    </Table.Td>
    <Table.Td>{tab.name}</Table.Td>
    <Table.Td style={actionRowStyle(1)}>
      <Group gap="xs">
        <Tooltip label={"Show"} openDelay={500}>
          <ActionIcon color={tab.color} onClick={show}>
            <IconClick style={actionIconStyle} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Table.Td>
  </Table.Tr>
);

interface TabsTableProps {
  tabs: SSHSingleServer[];
  show: (nonce: string) => void;
  selectedTabsNonce: string[];
  setSelectedTabsNonce: (state: string[]) => void;
}
const TabsTable = ({
  tabs,
  show,
  selectedTabsNonce,
  setSelectedTabsNonce,
}: TabsTableProps) => (
  <Table
    stickyHeader
    stickyHeaderOffset={-1}
    highlightOnHover
    withTableBorder
    striped
  >
    <Table.Thead
      style={{
        zIndex: 1,
      }}
    >
      <TabsTableHead
        selectAll={(state) => {
          if (state) {
            setSelectedTabsNonce(tabs.map((tab) => tab.nonce));
          } else {
            setSelectedTabsNonce([]);
          }
        }}
        selectedState={
          selectedTabsNonce.length === 0
            ? "none"
            : selectedTabsNonce.length === tabs.length
              ? "all"
              : "partial"
        }
      />
    </Table.Thead>
    <Table.Tbody>
      {tabs.map((tab) => (
        <TabsTableRow
          key={tab.nonce}
          tab={tab}
          show={() => show(tab.nonce)}
          isSelected={selectedTabsNonce.includes(tab.nonce)}
          setIsSelected={(state) => {
            if (state) {
              if (!selectedTabsNonce.includes(tab.nonce)) {
                setSelectedTabsNonce(selectedTabsNonce.concat(tab.nonce));
              }
            } else {
              const keyIndex = selectedTabsNonce.findIndex(
                (i) => i === tab.nonce,
              );
              if (keyIndex > -1) {
                setSelectedTabsNonce([
                  ...selectedTabsNonce.slice(0, keyIndex),
                  ...selectedTabsNonce.slice(keyIndex + 1),
                ]);
              }
            }
          }}
        />
      ))}
    </Table.Tbody>
    <Table.Caption>
      {tabs.length > 0
        ? `Total ${tabs.length} tabs.`
        : "Let's open a server tab!"}
    </Table.Caption>
  </Table>
);

export default TabsTable;
