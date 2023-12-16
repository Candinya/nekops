import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { actionIconStyle } from "@/common/actionStyles.ts";
import type { Server } from "@/types/server.ts";

const RescuePage = () => {
  const servers = useSelector((state: RootState) => state.servers);

  const [isUnlocked, setIsUnlocked] = useState(false);

  const startRescue = (server: Server) => {
    console.log(server.access.emergency);
  };

  // Search related
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  return (
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

          <Group gap="xs">
            <ActionIcon
              size="lg"
              color={isUnlocked ? "green" : "orange"}
              onClick={() => {
                // TODO: Unlock
                setIsUnlocked(!isUnlocked);
              }}
            >
              {isUnlocked ? (
                <IconLockOpen style={actionIconStyle} />
              ) : (
                <IconLock style={actionIconStyle} />
              )}
            </ActionIcon>
          </Group>
        </Flex>
      </Box>
      <ScrollArea h="100%">
        <LoadingOverlay
          visible={!isUnlocked}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{
            children: (
              <Flex direction="column" align="center" gap="sm">
                <Loader type="bars" color={"orange"} />
                <Text>Please unlock first...</Text>
              </Flex>
            ),
          }}
        />
        <Flex px="md" pb="md" direction="column" gap="md">
          {searchServers(debouncedSearchInput, servers).map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onClick={isUnlocked ? () => startRescue(server) : undefined}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default RescuePage;
