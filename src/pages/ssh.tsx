import { Box, Flex, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";

const SSH = () => {
  const servers = useSelector((state: RootState) => state.servers);

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
              onClick={() => {
                let command = `ssh ${server.access.regular.user}@${server.access.regular.address}`;
                if (server.access.regular.port !== 22) {
                  // Is not default SSH port
                  command += ` -p ${server.access.regular.port}`;
                }
                console.log(command);
              }}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SSH;
