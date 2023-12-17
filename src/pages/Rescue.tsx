import {
  ActionIcon,
  Box,
  Button,
  Code,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  PasswordInput,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import { useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { searchServers } from "@/search/servers.ts";
import {
  IconClipboardCheck,
  IconClipboardCopy,
  IconLock,
  IconLockOpen,
} from "@tabler/icons-react";
import { actionIconStyle } from "@/common/actionStyles.ts";
import type { Server } from "@/types/server.ts";
import { decryptServer } from "@/slices/encryptionSlice.ts";
import { notifications } from "@mantine/notifications";
import UnlockModal from "@/components/UnlockModal.tsx";
import CopyButton from "@/components/CopyButton.tsx";

interface CopyProps {
  value?: string;
}
const Copy = ({ value }: CopyProps) => (
  <CopyButton value={value || ""}>
    {({ copied, copy }) => (
      <Tooltip label={copied ? "Copied!" : "Copy"} openDelay={500}>
        <ActionIcon
          size="lg"
          color={copied ? "teal" : "blue"}
          onClick={copy}
          style={{
            alignSelf: "end",
          }}
        >
          {copied ? <IconClipboardCheck /> : <IconClipboardCopy />}
        </ActionIcon>
      </Tooltip>
    )}
  </CopyButton>
);

interface RescueModalProps {
  isOpen: boolean;
  close: () => void;
  server: Server | null;
}
const RescueModal = ({ isOpen, close, server }: RescueModalProps) => (
  <Modal
    opened={isOpen}
    onClose={close}
    title={
      <>
        Emergency access for <Code>{server?.name}</Code>
      </>
    }
    size="lg"
    centered
  >
    <Flex direction="column" gap="md">
      {server?.access.emergency.root_password && (
        <Group>
          <PasswordInput
            label="Root Password"
            value={server?.access.emergency.root_password}
            readOnly
            style={{
              flexGrow: 1,
            }}
          />
          <Copy value={server?.access.emergency.root_password} />
        </Group>
      )}
      <Group>
        <Flex direction="column">
          <Text size="sm" fw={500} mb={2}>
            Type
          </Text>
          <Tooltip
            label={`Launch ${server?.access.emergency.method}`}
            openDelay={500}
          >
            <Button
              style={{
                alignSelf: "end",
              }}
            >
              {server?.access.emergency.method}
            </Button>
          </Tooltip>
        </Flex>
        <TextInput
          label="Address"
          value={server?.access.emergency.address}
          readOnly
          style={{
            flexGrow: 1,
          }}
        />
        <Copy value={server?.access.emergency.address} />
      </Group>
      {server?.access.emergency.username && (
        <Group>
          <TextInput
            label="Username"
            value={server?.access.emergency.username}
            readOnly
            style={{
              flexGrow: 1,
            }}
          />
          <Copy value={server?.access.emergency.username} />
        </Group>
      )}
      {server?.access.emergency.password && (
        <Group>
          <PasswordInput
            label="Password"
            value={server?.access.emergency.password}
            readOnly
            style={{
              flexGrow: 1,
            }}
          />
          <Copy value={server?.access.emergency.password} />
        </Group>
      )}
      {server?.access.emergency.comment && (
        <Textarea
          label="Comment"
          value={server?.access.emergency.comment}
          minRows={3}
          autosize
          readOnly
        />
      )}
    </Flex>
  </Modal>
);

const RescuePage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const encryption = useSelector((state: RootState) => state.encryption);

  const [
    isUnlockModalOpen,
    { open: openUnlockModal, close: closeUnlockModal },
  ] = useDisclosure(false);

  const [
    isRescueModalOpen,
    { open: openRescueModal, close: closeRescueModal },
  ] = useDisclosure(false);

  const [activeServer, setActiveServer] = useState<Server | null>(null);

  const startRescue = (server: Server) => {
    if (!encryption.isUnlocked) {
      // Do nothing
      return;
    }

    setActiveServer(decryptServer(encryption, server));
    openRescueModal();
  };

  // Search related
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

            <Tooltip label="Unlock" openDelay={500}>
              <ActionIcon
                size="lg"
                color={encryption.isUnlocked ? "green" : "orange"}
                onClick={() => {
                  if (encryption.isUnlocked) {
                    notifications.show({
                      color: "green",
                      title: "You've already unlocked!",
                      message: "Time to start rescue works XD",
                    });
                  } else {
                    openUnlockModal();
                  }
                }}
              >
                {encryption.isUnlocked ? (
                  <IconLockOpen style={actionIconStyle} />
                ) : (
                  <IconLock style={actionIconStyle} />
                )}
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>
        <ScrollArea h="100%">
          <LoadingOverlay
            visible={!encryption.isUnlocked}
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
                onClick={() => startRescue(server)}
              />
            ))}
          </Flex>
        </ScrollArea>
      </Flex>

      <UnlockModal
        isOpen={isUnlockModalOpen}
        close={closeUnlockModal}
        successMessage="Time to start rescue works XD"
      />

      <RescueModal
        isOpen={isRescueModalOpen}
        close={closeRescueModal}
        server={activeServer}
      />
    </>
  );
};

export default RescuePage;
