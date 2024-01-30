import { Box, Flex, Menu } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import SearchBar from "@/components/SearchBar.tsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedValue, useMouse } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import type { Server } from "@/types/server.ts";
import { openShellWindow } from "@/utils/openShellWindow.ts";
import { emit, listen } from "@tauri-apps/api/event";
import type { EventNewSSHPayload } from "@/events/payload.ts";
import { notifications } from "@mantine/notifications";
import {
  EventAckSSHWindowReady,
  EventIsSSHWindowReady,
  EventNewSSHName,
} from "@/events/name.ts";
import { randomString } from "@/utils/randomString.ts";
import ServerCardsVirtualScroll from "@/components/ServerCardsVirtualScroll.tsx";
import {
  FailNotification,
  LoadingNotification,
  SuccessNotification,
} from "@/notifications/shell.tsx";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { IconCode, IconRocket } from "@tabler/icons-react";
import { actionIconStyle } from "@/common/actionStyles.ts";

const startSSHSession = async (
  server: Server,
  disableContentProtection: boolean,
  jumpServer?: Server,
) => {
  // Create or open Shell window
  await openShellWindow(disableContentProtection); // Disable content protection when unlocked

  // Prepare checker
  let isReadyChecker: ReturnType<typeof setInterval> | null = null;

  // Set notification
  let loadingNotify: string | null = notifications.show(LoadingNotification);

  // Generate random nonce to prevent possible conflict, for both server and event
  const nonce = randomString(8);

  // Wait till window is ready
  const isReadyListenerStopFn = await listen<string>(
    EventAckSSHWindowReady,
    async (ev) => {
      if (ev.payload !== nonce) {
        // Not for this session
        return;
      }

      // Stop checker
      if (isReadyChecker) {
        clearInterval(isReadyChecker);
      }

      // Update notification
      if (loadingNotify) {
        notifications.update({
          ...SuccessNotification,
          id: loadingNotify,
        });
        loadingNotify = null;
      }

      // Emit SSH event
      const newSSHEvent: EventNewSSHPayload = {
        servers: [
          {
            nonce,
            name: server.name,
            color: server.color,
            access: server.access.regular,
            jumpServer: jumpServer ? jumpServer.access.regular : undefined,
          },
        ],
      };
      await emit(EventNewSSHName, newSSHEvent);

      // Close listener
      isReadyListenerStopFn();
    },
  );

  // Start check interval
  isReadyChecker = setInterval(() => {
    emit(EventIsSSHWindowReady, nonce);
  }, 200);

  // Set timeout notice
  setTimeout(() => {
    if (loadingNotify) {
      // Still loading
      notifications.update({
        ...FailNotification,
        id: loadingNotify,
      });
    }
  }, 10_000); // 10 seconds
};

const copySSHCommand = async (server: Server, jumpServer?: Server) => {
  const command = ["ssh"];
  if (jumpServer) {
    command.push(
      "-J",
      `${jumpServer.access.regular.user || "root"}@${
        jumpServer.access.regular.address
      }` +
        (jumpServer.access.regular.port !== 22
          ? `:${jumpServer.access.regular.port}`
          : ""),
    );
  }
  if (server.access.regular.port !== 22) {
    command.push("-p", `${server.access.regular.port}`);
  }
  command.push(
    `${server.access.regular.user || "root"}@${server.access.regular.address}`,
  );
  try {
    await writeText(command.join(" "));
    notifications.show({
      color: "green",
      title: "SSH command copied!",
      message: "Paste into your favorite shell and let's start!",
    });
  } catch (e) {
    notifications.show({
      color: "red",
      title: "Failed to copy...",
      message: "Maybe let the server's id to remind of something?",
    });
  }
};

interface SSHContextMenuProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  jumpServers: Server[];

  onClickCopy: () => void;
  onClickStart: () => void;
  onClickJumpServer: (jumpServer: Server) => void;
}
const SSHContextMenu = ({
  isOpen,
  setIsOpen,
  jumpServers,

  onClickCopy,
  onClickStart,
  onClickJumpServer,
}: SSHContextMenuProps) => {
  const { x, y } = useMouse();

  const [menuLocation, setMenuLocation] = useState({
    left: 0,
    top: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setMenuLocation({
        left: x,
        top: y,
      });
    }
  }, [isOpen]);

  return (
    <Menu opened={isOpen} onChange={setIsOpen}>
      <Menu.Target>
        <div />
      </Menu.Target>
      <Menu.Dropdown left={menuLocation.left} top={menuLocation.top}>
        <Menu.Label>Connect Directly</Menu.Label>
        <Menu.Item
          leftSection={<IconCode style={actionIconStyle} />}
          onClick={onClickCopy}
        >
          Copy Code
        </Menu.Item>
        <Menu.Item
          leftSection={<IconRocket style={actionIconStyle} />}
          onClick={onClickStart}
        >
          Start Session
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Connect w/ Jump Server</Menu.Label>
        {jumpServers.map((js) => (
          <Menu.Item key={js.id} onClick={() => onClickJumpServer(js)}>
            {js.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

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
  const encryption = useSelector((state: RootState) => state.encryption);
  const settings = useSelector((state: RootState) => state.settings);

  const clickServerCard = (server: Server, jumpServer?: Server) => {
    switch (settings.default_ssh_action) {
      case "start":
        startSSHSession(server, encryption.isUnlocked, jumpServer);
        break;
      case "copy":
      default:
        copySSHCommand(server, jumpServer);
        break;
    }
  };

  const currentSelectedServer = useRef<Server | null>(null);
  const rightClickServerCard = (server: Server) => {
    currentSelectedServer.current = server;
    setIsSSHContextMenuOpen(true);
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

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
        jumpServers={jumpServers}
        onClickCopy={() => {
          if (currentSelectedServer.current) {
            copySSHCommand(currentSelectedServer.current);
          }
        }}
        onClickStart={() => {
          if (currentSelectedServer.current) {
            startSSHSession(
              currentSelectedServer.current,
              encryption.isUnlocked,
            );
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
