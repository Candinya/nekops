import { Box, Flex } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { type MouseEvent, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import ServerCardsVirtualScroll from "@/components/ServerCardsVirtualScroll.tsx";
import SSHContextMenu from "@/components/ssh/SSHContextMenu.tsx";
import { startSSHSession } from "@/components/ssh/startSSHSession.ts";
import { copySSHCommand } from "@/components/ssh/copySSHCommand.ts";

const SSHPage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const serversWithRegularAccess = useMemo(
    () => servers.filter((server) => Boolean(server.access.regular.address)),
    [servers],
  );
  const jumpServers = useMemo(
    () => servers.filter((server) => server.access.regular.is_jump_server),
    [servers],
  );
  const settings = useSelector((state: RootState) => state.settings);

  const clickServerCard = (server: Server, jumpServer?: Server) => {
    switch (settings.default_ssh_action) {
      case "start":
        startSSHSession(server, jumpServer);
        break;
      case "copy":
      default:
        copySSHCommand(server, jumpServer);
        break;
    }
  };

  const currentSelectedServer = useRef<Server | null>(null);
  const rightClickServerCard = (
    ev: MouseEvent<HTMLDivElement>,
    server: Server,
  ) => {
    currentSelectedServer.current = server;
    setSSHContextMenuPos({
      x: ev.clientX,
      y: ev.clientY,
    });
    setIsSSHContextMenuOpen(true);
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  const [sshContextMenuPos, setSSHContextMenuPos] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [isSSHContextMenuOpen, setIsSSHContextMenuOpen] = useState(false);

  return (
    <>
      <Flex
        direction="column"
        h="100%"
        style={{
          overflow: "hidden",
        }}
      >
        <Box p="md">
          <SearchBar
            placeholder="Search servers"
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            debouncedSearchInput={debouncedSearchInput}
          />
        </Box>
        <ServerCardsVirtualScroll
          servers={searchServers(
            debouncedSearchInput,
            serversWithRegularAccess,
          )}
          onClicked={clickServerCard}
          onContextMenu={rightClickServerCard}
        />
      </Flex>
      <SSHContextMenu
        isOpen={isSSHContextMenuOpen}
        setIsOpen={setIsSSHContextMenuOpen}
        pos={sshContextMenuPos}
        jumpServers={jumpServers}
        onClickCopy={() => {
          if (currentSelectedServer.current) {
            copySSHCommand(currentSelectedServer.current);
          }
        }}
        onClickStart={() => {
          if (currentSelectedServer.current) {
            startSSHSession(currentSelectedServer.current);
          }
        }}
        onClickJumpServer={(jumpServer: Server) => {
          if (currentSelectedServer.current) {
            clickServerCard(currentSelectedServer.current, jumpServer);
          }
        }}
      />
    </>
  );
};

export default SSHPage;
