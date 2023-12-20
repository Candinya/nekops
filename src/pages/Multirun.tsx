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
import type { Server } from "@/types/server.ts";
import { Command } from "@tauri-apps/plugin-shell";

const MultirunPage = () => {
  const servers = useSelector((state: RootState) => state.servers);

  const [
    isServerCardModalOpen,
    { open: openServerCardModal, close: closeServerCardModal },
  ] = useDisclosure(false);

  const [activeServerIndex, setActiveServerIndex] = useState<number>(-1);
  const [selectedServerIDs, setSelectedServerIDs] = useState<string[]>([]);

  const startSSH = (server: Server) => {
    const sshArgs = [
      `${server.access.regular.user || "root"}@${
        server.access.regular.address
      }`,
      "-tt", // force Pseudo-terminal
    ];
    if (server.access.regular.port !== 22) {
      // Is not default SSH port
      sshArgs.push("-p", server.access.regular.port.toString());
    }
    const sshProcess = Command.create("ssh", sshArgs);
    sshProcess.on("close", (data) => {
      console.log("close", data);
    });
    sshProcess.on("error", (data) => {
      console.log("error", data);
    });
    sshProcess.stdout.on("data", (data) => {
      console.log("stdout", data);
    });
    sshProcess.stderr.on("data", (data) => {
      console.log("stderr", data);
    });
    // sshProcess.execute().then(console.log);
    sshProcess.spawn().then(console.log);
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
                onClick={() => {
                  // TODO: Multirun
                  console.log(selectedServerIDs);
                }}
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
