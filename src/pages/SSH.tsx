import { Box, Flex, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { openShellWindow } from "@/utils/openShellWindow.ts";
import { emit } from "@tauri-apps/api/event";
import type { EventsNewSSH } from "@/types/crossEvents.ts";

const SSHPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const encryption = useSelector((state: RootState) => state.encryption);

  const startSSH = async (server: Server) => {
    // Create or open Shell window
    await openShellWindow(encryption.isUnlocked); // Disable content protection when unlocked

    // Emit SSH event
    const newSSHEvent: EventsNewSSH = {
      server,
    };
    await emit("newSSH", newSSHEvent);
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  return (
    <Flex direction="column" h="100%">
      <Box p="md">
        <SearchBar
          placeholder="Search servers"
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          debouncedSearchInput={debouncedSearchInput}
        />
      </Box>
      <ScrollArea>
        <Flex px="md" pb="md" direction="column" gap="md">
          {searchServers(debouncedSearchInput, servers).map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onClick={() => startSSH(server)}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SSHPage;
