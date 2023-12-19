import { ActionIcon, Flex, Group, rem, Table, Tooltip } from "@mantine/core";
import {
  IconClipboardCheck,
  IconClipboardCopy,
  IconGripVertical,
  IconPencil,
} from "@tabler/icons-react";

import type { Snippet } from "@/types/snippet.ts";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";
import CopyButton from "@/components/CopyButton.tsx";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const SnippetTableHead = () => (
  <Table.Tr>
    <Table.Th style={{ width: rem(40) }} />
    <Table.Th>Snippet Name</Table.Th>
    <Table.Th>Tags</Table.Th>
    <Table.Th style={actionRowStyle}>Actions</Table.Th>
  </Table.Tr>
);

interface SnippetTableRowProps {
  index: number;
  snippet: Snippet;
  edit: () => void;
  del: () => void;
}
const SnippetTableRow = ({
  index,
  snippet,
  edit,
  del,
}: SnippetTableRowProps) => (
  <Draggable draggableId={snippet.name} index={index}>
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
        <Table.Td>{snippet.name}</Table.Td>
        <Table.Td>{snippet.tags.join(", ")}</Table.Td>
        <Table.Td style={actionRowStyle}>
          <Group gap="xs" justify="center">
            {/*Copy*/}
            <CopyButton value={snippet.code}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied!" : "Copy"} openDelay={500}>
                  <ActionIcon color={copied ? "cyan" : "green"} onClick={copy}>
                    {copied ? (
                      <IconClipboardCheck style={actionIconStyle} />
                    ) : (
                      <IconClipboardCopy style={actionIconStyle} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>

            {/*Edit*/}
            <Tooltip label={"Edit"} openDelay={500}>
              <ActionIcon onClick={edit}>
                <IconPencil style={actionIconStyle} />
              </ActionIcon>
            </Tooltip>

            {/*Delete*/}
            <DeleteItemButton
              itemName={`Snippet ${snippet.name}`}
              iconStyle={actionIconStyle}
              onClick={del}
            />
          </Group>
        </Table.Td>
      </Table.Tr>
    )}
  </Draggable>
);

interface SnippetTableProps {
  snippets: Snippet[];
  edit: (index: number) => void;
  del: (index: number) => void;
  reorder: (sourceIndex: number, destinationIndex: number) => void;
  isSearching: boolean;
}
const SnippetTable = ({
  snippets,
  edit,
  del,
  reorder,
  isSearching,
}: SnippetTableProps) => (
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
        <SnippetTableHead />
      </Table.Thead>
      <Droppable droppableId="snippets-list" direction="vertical">
        {(provided) => (
          <Table.Tbody ref={provided.innerRef} {...provided.droppableProps}>
            {snippets.map((snippet, index) => (
              <SnippetTableRow
                key={snippet.name}
                index={index}
                snippet={snippet}
                edit={() => edit(index)}
                del={() => del(index)}
              />
            ))}
            {provided.placeholder}
          </Table.Tbody>
        )}
      </Droppable>
      <Table.Caption>
        {snippets.length > 0
          ? `Total ${snippets.length} snippets.`
          : isSearching
            ? "No matching results."
            : "Let's add first snippet!"}
      </Table.Caption>
    </Table>
  </DragDropContext>
);

export default SnippetTable;
