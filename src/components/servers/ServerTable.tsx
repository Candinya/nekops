import { ActionIcon, Flex, Group, rem, Table, Tooltip } from "@mantine/core";
import { IconGripVertical, IconId, IconPencil } from "@tabler/icons-react";

import type { Server } from "@/types/server.ts";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";
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
  show: (server: Server) => void;
  edit: (server: Server) => void;
  del: (server: Server) => void;
  reorder: (sourceServerID: string, destinationServerID: string) => void;
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
      reorder(servers[source.index].id, servers[destination?.index || 0].id);
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
                show={() => show(server)}
                edit={() => edit(server)}
                del={() => del(server)}
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

export default ServerTable;
