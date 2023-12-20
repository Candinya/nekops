import { Box, Flex, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { Command } from "@tauri-apps/plugin-shell";

const SSHPage = () => {
  const servers = useSelector((state: RootState) => state.servers);

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
