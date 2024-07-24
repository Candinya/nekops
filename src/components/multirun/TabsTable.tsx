import { Checkbox, rem, Table } from "@mantine/core";
import { actionRowStyle } from "@/common/actionStyles.ts";
import type {
  EventResponseTabsListPayload,
  EventResponseTabsListPayloadSingleTab,
} from "@/events/payload.ts";
import TabStateIcon from "@/components/TabStateIcon.tsx";

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
          onChange={(ev) => selectAll(ev.currentTarget.checked)}
        />
      </Table.Th>
      <Table.Th>Server Name</Table.Th>
      <Table.Th style={actionRowStyle(1)}>State</Table.Th>
    </Table.Tr>
  );
};

interface TabsTableRowProps {
  tab: EventResponseTabsListPayloadSingleTab;
  show: () => void;
  isSelected: boolean;
  setIsSelected: (state: boolean) => void;
  isCurrentActive: boolean;
}
const TabsTableRow = ({
  tab,
  show,
  isSelected,
  setIsSelected,
  isCurrentActive,
}: TabsTableRowProps) => (
  <Table.Tr
    onClick={show}
    style={{
      cursor: "pointer",
      backgroundColor: isCurrentActive ? "var(--table-hover-color)" : undefined,
    }}
  >
    <Table.Td>
      <Checkbox
        checked={isSelected}
        onChange={(ev) => setIsSelected(ev.currentTarget.checked)}
        color={tab.server.color}
      />
    </Table.Td>
    <Table.Td>{tab.server.name}</Table.Td>
    <Table.Td ta="center">
      <TabStateIcon state={tab.state} isNewMessage={tab.isNewMessage} />
    </Table.Td>
  </Table.Tr>
);

interface TabsTableProps {
  tabs: EventResponseTabsListPayload;
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
  <Table stickyHeader stickyHeaderOffset={-1} highlightOnHover withTableBorder>
    <Table.Thead
      style={{
        zIndex: 1,
      }}
    >
      <TabsTableHead
        selectAll={(state) => {
          if (state) {
            setSelectedTabsNonce(tabs.tabs.map((tab) => tab.server.nonce));
          } else {
            setSelectedTabsNonce([]);
          }
        }}
        selectedState={
          selectedTabsNonce.length === 0
            ? "none"
            : selectedTabsNonce.length === tabs.tabs.length
              ? "all"
              : "partial"
        }
      />
    </Table.Thead>
    <Table.Tbody>
      {tabs.tabs.map((tab) => (
        <TabsTableRow
          key={tab.server.nonce}
          tab={tab}
          show={() => show(tab.server.nonce)}
          isSelected={selectedTabsNonce.includes(tab.server.nonce)}
          setIsSelected={(state) => {
            if (state) {
              if (!selectedTabsNonce.includes(tab.server.nonce)) {
                setSelectedTabsNonce(
                  selectedTabsNonce.concat(tab.server.nonce),
                );
              }
            } else {
              const keyIndex = selectedTabsNonce.findIndex(
                (i) => i === tab.server.nonce,
              );
              if (keyIndex > -1) {
                setSelectedTabsNonce([
                  ...selectedTabsNonce.slice(0, keyIndex),
                  ...selectedTabsNonce.slice(keyIndex + 1),
                ]);
              }
            }
          }}
          isCurrentActive={tabs.currentActive === tab.server.nonce}
        />
      ))}
    </Table.Tbody>
    <Table.Caption>
      {tabs.tabs.length > 0
        ? `Total ${tabs.tabs.length} tabs.`
        : "Let's open a server tab!"}
    </Table.Caption>
  </Table>
);

export default TabsTable;
