import {
  ActionIcon,
  Box,
  Flex,
  Group,
  ScrollArea,
  Table,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconClipboardCheck,
  IconClipboardCopy,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Snippet } from "@/types/snippet.ts";
import EditSnippetModal from "@/components/EditSnippetModal.tsx";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  addSnippet,
  removeSnippetByIndex,
  saveSnippets,
  updateSnippetByIndex,
} from "@/slices/snippetsSlice.ts";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import { searchSnippets } from "@/search/snippets.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle, actionRowStyle } from "@/common/actionStyles.ts";
import CopyButton from "@/components/CopyButton.tsx";

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
  edit: () => void;
  del: () => void;
}
const SnippetTableRow = ({ no, snippet, edit, del }: SnippetTableRowProps) => (
  <Table.Tr>
    <Table.Td>{no}</Table.Td>
    <Table.Td>{snippet.name}</Table.Td>
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
);

interface SnippetTableProps {
  snippets: Snippet[];
  edit: (index: number) => void;
  del: (index: number) => void;
  isSearching: boolean;
}
const SnippetTable = ({
  snippets,
  edit,
  del,
  isSearching,
}: SnippetTableProps) => (
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
          edit={() => edit(index)}
          del={() => del(index)}
        />
      ))}
    </Table.Tbody>
    <Table.Caption>
      {snippets.length > 0
        ? `Total ${snippets.length} snippets.`
        : isSearching
          ? "No matching results."
          : "Let's add first snippet!"}
    </Table.Caption>
  </Table>
);

const SnippetsPage = () => {
  const snippets = useSelector((state: RootState) => state.snippets);
  const dispatch = useDispatch<AppDispatch>();

  const [
    isEditSnippetModalOpen,
    { open: openEditSnippetModal, close: closeEditSnippetModal },
  ] = useDisclosure(false);

  const [activeSnippetIndex, setActiveSnippetIndex] = useState<number>(-1);

  const save = (newSnippetInfo: Snippet) => {
    if (activeSnippetIndex !== -1) {
      // Edit
      dispatch(
        updateSnippetByIndex({
          index: activeSnippetIndex,
          snippet: newSnippetInfo,
        }),
      );
    } else {
      // Create
      dispatch(addSnippet(newSnippetInfo));
    }
    dispatch(saveSnippets());
  };

  const del = (index: number) => {
    dispatch(removeSnippetByIndex(index));
    dispatch(saveSnippets());
  };

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  return (
    <>
      <Flex direction="column" h="100%">
        <Box p="md">
          {/*Search and Create*/}
          <Flex direction="row" justify="space-between" gap="lg">
            <SearchBar
              placeholder="Search snippets"
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              debouncedSearchInput={debouncedSearchInput}
            />

            <Tooltip label="New snippet" openDelay={500}>
              <ActionIcon
                size="lg"
                color="green"
                onClick={() => {
                  setActiveSnippetIndex(-1);
                  openEditSnippetModal();
                }}
              >
                <IconPlus style={actionIconStyle} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>

        {/*Snippet Table*/}
        <ScrollArea>
          <SnippetTable
            snippets={searchSnippets(debouncedSearchInput, snippets)}
            edit={(index) => {
              setActiveSnippetIndex(index);
              openEditSnippetModal();
            }}
            del={del}
            isSearching={debouncedSearchInput !== ""}
          />
        </ScrollArea>
      </Flex>

      {/*Edit Modal*/}
      <EditSnippetModal
        isOpen={isEditSnippetModalOpen}
        close={closeEditSnippetModal}
        snippetInfo={
          activeSnippetIndex === -1 ? undefined : snippets[activeSnippetIndex]
        }
        save={save}
      />
    </>
  );
};

export default SnippetsPage;
