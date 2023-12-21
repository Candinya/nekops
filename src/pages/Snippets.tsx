import { ActionIcon, Box, Flex, ScrollArea, Tooltip } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Snippet } from "@/types/snippet.ts";
import EditSnippetModal from "@/components/EditSnippetModal.tsx";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  addSnippet,
  removeSnippetByIndex,
  reorderSnippet,
  saveSnippets,
  updateSnippetByIndex,
} from "@/slices/snippetsSlice.ts";
import { searchSnippets } from "@/search/snippets.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle } from "@/common/actionStyles.ts";
import SnippetTable from "@/components/snippets/SnippetTable.tsx";
import { notifications } from "@mantine/notifications";

const SnippetsPage = () => {
  const snippets = useSelector((state: RootState) => state.snippets);
  const dispatch = useDispatch<AppDispatch>();

  const [
    isEditSnippetModalOpen,
    { open: openEditSnippetModal, close: closeEditSnippetModal },
  ] = useDisclosure(false);

  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);

  const notifyDupName = () => {
    notifications.show({
      color: "yellow",
      title: "Duplicate name found",
      message: <>Specified name is conflict with another snippet.</>,
    });
  };

  const save = (newSnippetInfo: Snippet): boolean => {
    // Check duplicate ID
    if (activeSnippet === null || newSnippetInfo.name !== activeSnippet.name) {
      const findSnippetByName = snippets.find(
        (snippet) => snippet.name === newSnippetInfo.name,
      );
      if (findSnippetByName !== undefined) {
        // Found
        notifyDupName();
        return false;
      }
    }

    if (activeSnippet !== null) {
      // Edit
      dispatch(
        updateSnippetByIndex({
          index: snippets.findIndex(
            (snippet) => snippet.name === activeSnippet.name,
          ),
          snippet: newSnippetInfo,
        }),
      );
    } else {
      // Create
      dispatch(addSnippet(newSnippetInfo));
    }
    dispatch(saveSnippets());
    return true;
  };

  const del = (snippet: Snippet) => {
    dispatch(
      removeSnippetByIndex(snippets.findIndex((s) => s.name === snippet.name)),
    );
    dispatch(saveSnippets());
  };

  const reorder = (
    sourceSnippetName: string,
    destinationSnippetName: string,
  ) => {
    if (sourceSnippetName !== destinationSnippetName) {
      dispatch(
        reorderSnippet({
          sourceIndex: snippets.findIndex((s) => s.name === sourceSnippetName),
          destinationIndex: snippets.findIndex(
            (s) => s.name === destinationSnippetName,
          ),
        }),
      );
      dispatch(saveSnippets());
    }
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
                  setActiveSnippet(null);
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
            edit={(snippet) => {
              setActiveSnippet(snippet);
              openEditSnippetModal();
            }}
            del={del}
            reorder={reorder}
            isSearching={debouncedSearchInput !== ""}
          />
        </ScrollArea>
      </Flex>

      {/*Edit Modal*/}
      <EditSnippetModal
        isOpen={isEditSnippetModalOpen}
        close={closeEditSnippetModal}
        snippetInfo={activeSnippet}
        save={save}
      />
    </>
  );
};

export default SnippetsPage;
