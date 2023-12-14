import {
  ActionIcon,
  Box,
  Code,
  Flex,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconClipboardCopy,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import type { Snippet } from "@/types/snippet.ts";
import EditSnippetModal from "@/components/EditSnippetModal.tsx";
import { notifications } from "@mantine/notifications";

const actionIconStyle = { width: "70%", height: "70%" };

const actionRowStyle = {
  width: "calc(8rem * var(--mantine-scale))",
};

const SnippetTableHead = () => (
  <Table.Tr>
    <Table.Th>#</Table.Th>
    <Table.Th>Snippet Name</Table.Th>
    <Table.Th style={actionRowStyle}>Actions</Table.Th>
  </Table.Tr>
);

interface SnippetTableRowProps {
  no: number;
  snippet: Snippet;
  copy: () => void;
  edit: () => void;
  del: () => void;
}
const SnippetTableRow = ({
  no,
  snippet,
  copy,
  edit,
  del,
}: SnippetTableRowProps) => (
  <Table.Tr>
    <Table.Td>{no}</Table.Td>
    <Table.Td>{snippet.name}</Table.Td>
    <Table.Td style={actionRowStyle}>
      <Group gap="xs">
        <Tooltip label={"Copy"} openDelay={500}>
          <ActionIcon color="green" onClick={copy}>
            <IconClipboardCopy style={actionIconStyle} />
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

interface SnippetTableProps {
  snippets: Snippet[];
  copy: (index: number) => void;
  edit: (index: number) => void;
  del: (index: number) => void;
}
const SnippetTable = ({ snippets, copy, edit, del }: SnippetTableProps) => (
  <Table stickyHeader stickyHeaderOffset={0} highlightOnHover>
    <Table.Thead
      style={{
        zIndex: 1,
      }}
    >
      <SnippetTableHead />
    </Table.Thead>
    <Table.Tbody>
      {snippets.map((snippet, index) => (
        <SnippetTableRow
          key={snippet.name}
          no={index + 1}
          snippet={snippet}
          copy={() => copy(index)}
          edit={() => edit(index)}
          del={() => del(index)}
        />
      ))}
    </Table.Tbody>
    <Table.Caption>
      {snippets.length > 0
        ? `Total ${snippets.length} snippets.`
        : "Let's add first snippet!"}
    </Table.Caption>
  </Table>
);

const Snippets = () => {
  const [
    isEditSnippetModalOpen,
    { open: openEditSnippetModal, close: closeEditSnippetModal },
  ] = useDisclosure(false);

  const [snippetInfo, setSnippetInfo] = useState<Snippet | undefined>(
    undefined,
  );

  const [snippets, setSnippets] = useState<Snippet[]>([]);

  const save = (newSnippetInfo: Snippet) => {
    if (!!snippetInfo) {
      // Edit
      const index = snippets.findIndex(
        (snippet) => snippet.name === snippetInfo.name,
      );
      setSnippets([
        ...snippets.slice(0, index),
        newSnippetInfo,
        ...snippets.slice(index + 1),
      ]);
    } else {
      // Create
      setSnippets([...snippets, newSnippetInfo]);
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
              placeholder="Search snippets"
              style={{
                flexGrow: 1,
              }}
            />

            <Group gap="xs">
              <ActionIcon
                size="lg"
                color="green"
                onClick={() => {
                  setSnippetInfo(undefined);
                  openEditSnippetModal();
                }}
              >
                <IconPlus style={actionIconStyle} />
              </ActionIcon>
            </Group>
          </Flex>
        </Box>

        {/*Snippet Table*/}
        <ScrollArea>
          <SnippetTable
            snippets={snippets}
            copy={(index) => {
              try {
                navigator.clipboard.writeText(snippets[index].code);

                notifications.show({
                  color: "green",
                  title: "Copied successfully!",
                  message: (
                    <Text>
                      Feel free to paste this snippet{" "}
                      <Code>{snippets[index].name}</Code> anywhere
                    </Text>
                  ),
                });
              } catch (e) {
                notifications.show({
                  color: "yellow",
                  title: "Copy failed...",
                  message:
                    "You may need to copy this snippet from edit form manually. Sorry for the inconvenience.",
                });
              }
            }}
            edit={(index) => {
              setSnippetInfo(snippets[index]);
              openEditSnippetModal();
            }}
            del={(index) => {
              setSnippets([
                ...snippets.slice(0, index),
                ...snippets.slice(index + 1),
              ]);
            }}
          />
        </ScrollArea>
      </Flex>

      {/*Edit Modal*/}
      <EditSnippetModal
        isOpen={isEditSnippetModalOpen}
        close={closeEditSnippetModal}
        snippetInfo={snippetInfo}
        save={save}
      />
    </>
  );
};

export default Snippets;
