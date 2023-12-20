import { ActionIcon, Box, Flex, ScrollArea, Tooltip } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCardModal from "@/components/ServerCardModal.tsx";
import { searchServers } from "@/search/servers.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { actionIconStyle } from "@/common/actionStyles.ts";
import ServerTable from "@/components/multirun/ServerTable.tsx";
import { openShellWindow } from "@/utils/openShellWindow.ts";

const MultirunPage = () => {
  const servers = useSelector((state: RootState) => state.servers);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServerIndex, setActiveServerIndex] = useState<number>(-1);
  const [selectedServerIDs, setSelectedServerIDs] = useState<string[]>([]);

  const startMultirun = async () => {
    const shellWindow = await openShellWindow();
    console.log(shellWindow);
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
              placeholder="Search servers"
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              debouncedSearchInput={debouncedSearchInput}
            />

            <Tooltip label="Start" openDelay={500}>
              <ActionIcon
                size="lg"
                color="green"
                disabled={selectedServerIDs.length === 0}
                onClick={startMultirun}
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
            selectedServerIDs={selectedServerIDs}
            setSelectedServerIDs={setSelectedServerIDs}
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
