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

  const reorder = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex !== destinationIndex) {
      dispatch(
        reorderSnippet({
          sourceIndex,
          destinationIndex,
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
            reorder={reorder}
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
