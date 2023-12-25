import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Modal,
  rem,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconBellFilled, IconCircleFilled, IconX } from "@tabler/icons-react";
import ShellTerminal from "@/shell/ShellTerminal.tsx";
import type { Event } from "@tauri-apps/api/event";
import { emit, listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import {
  EventAckSSHWindowReady,
  EventIsSSHWindowReady,
  EventNewSSHName,
} from "@/events/name.ts";
import type { EventNewSSHPayload } from "@/events/payload.ts";
import { Window } from "@tauri-apps/api/window";
import type { ShellState } from "@/types/shellState.ts";
import { useDisclosure } from "@mantine/hooks";

interface ShellTabProps {
  data: EventNewSSHPayload;
  state?: ShellState;
  isNewMessage?: boolean;
  close: () => void;
}
const ShellTab = ({ data, state, isNewMessage, close }: ShellTabProps) => {
  const theme = useMantineTheme();
  const colorState =
    state === "loading"
      ? theme.colors.yellow[6]
      : state === "active"
        ? theme.colors.green[6]
        : state === "terminated"
          ? theme.colors.red[6]
          : theme.colors.gray[6];

  const LeftIcon = isNewMessage ? IconBellFilled : IconCircleFilled;

  return (
    <Tabs.Tab
      value={data.nonce}
      color={data.color}
      leftSection={
        <LeftIcon
          size={12}
          style={{
            color: colorState,
          }}
        />
      }
      rightSection={
        <ActionIcon
          size="xs"
          variant="subtle"
          color={data.color}
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          <IconX />
        </ActionIcon>
      }
      component="div"
    >
      {data.name}
    </Tabs.Tab>
  );
};

interface ShellPanelProps {
  data: EventNewSSHPayload;
  setShellState: (state: ShellState) => void;
  setNewMessage: () => void;
}
const ShellPanel = ({
  data,
  setShellState,
  setNewMessage,
}: ShellPanelProps) => (
  <Tabs.Panel value={data.nonce} h="100%">
    <ShellTerminal
      nonce={data.nonce}
      user={data.access.user}
      address={data.access.address}
      port={data.access.port}
      setShellState={setShellState}
      setNewMessage={setNewMessage}
    />
  </Tabs.Panel>
);

interface TerminateCloseModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  confirm: () => void;
}
const TerminateCloseModal = ({
  open,
  onClose,
  itemName,
  confirm,
}: TerminateCloseModalProps) => {
  return (
    <Modal title="Delete confirmation" opened={open} onClose={onClose} centered>
      <Text>Are you sure to terminate :</Text>
      <Title order={3} my="md" c="red">
        {itemName}
      </Title>
      <Center mt="lg">
        <Group gap="sm">
          <Button variant="default" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={confirm}>
            Confirm
          </Button>
        </Group>
      </Center>
    </Modal>
  );
};

const ShellTabs = () => {
  // For components render
  const [tabsData, setTabsData] = useState<EventNewSSHPayload[]>([]);
  const [tabsState, setTabsState] = useState<ShellState[]>([]);
  const [tabsNewMessage, setTabsNewMessage] = useState<boolean[]>([]);
  // For events binding
  const tabsDataRef = useRef<EventNewSSHPayload[]>([]);
  const tabsStateRef = useRef<ShellState[]>([]);
  const tabsNewMessageRef = useRef<boolean[]>([]);
  // Bind state : setTabsData -> tabsData -> tabsDataRef
  useEffect(() => {
    tabsDataRef.current = tabsData;
  }, [tabsData]);
  useEffect(() => {
    tabsStateRef.current = tabsState;
  }, [tabsState]);
  useEffect(() => {
    tabsNewMessageRef.current = tabsNewMessage;
  }, [tabsNewMessage]);

  const [currentActiveTab, setCurrentActiveTab] = useState<string | null>(null);
  const currentActiveTabRef = useRef<string | null>(null);
  useEffect(() => {
    currentActiveTabRef.current = currentActiveTab;
  }, [currentActiveTab]);

  const newSSHEventListener = (ev: Event<EventNewSSHPayload>) => {
    setTabsData(tabsDataRef.current.concat(ev.payload));
    setTabsState(tabsStateRef.current.concat("loading"));
    setTabsNewMessage(tabsNewMessageRef.current.concat(false));
    setCurrentActiveTab(ev.payload.nonce);
  };

  // Close (terminate) confirm
  const [terminateConfirmIndex, setTerminateConfirmIndex] = useState(-1);
  const [
    isTerminateConfirmModalOpen,
    { open: openTerminateConfirmModal, close: closeTerminateConfirmModal },
  ] = useDisclosure(false);
  const doClose = (index: number) => {
    const newTabsLength = tabsData.length - 1;
    setTabsData([...tabsData.slice(0, index), ...tabsData.slice(index + 1)]);
    setTabsState([...tabsState.slice(0, index), ...tabsState.slice(index + 1)]);
    setTabsNewMessage([
      ...tabsNewMessage.slice(0, index),
      ...tabsNewMessage.slice(index + 1),
    ]);

    if (newTabsLength === 0) {
      // Close window
      Window.getCurrent().close();
    }
  };

  const closeTab = (nonce: string) => {
    const index = tabsDataRef.current.findIndex(
      (state) => state.nonce === nonce,
    );
    if (index != -1) {
      if (tabsStateRef.current[index] === "active") {
        setTerminateConfirmIndex(index);
        openTerminateConfirmModal();
      } else {
        doClose(index);
      }
    }
  };

  const setTabShellState = (newState: ShellState, nonce: string) => {
    const index = tabsDataRef.current.findIndex(
      (state) => state.nonce === nonce,
    );
    if (tabsStateRef.current[index] !== "terminated") {
      setTabsState([
        ...tabsStateRef.current.slice(0, index),
        newState,
        ...tabsStateRef.current.slice(index + 1),
      ]);
    }
  };

  const setTabNewMessageState = (nonce: string) => {
    const index = tabsDataRef.current.findIndex(
      (state) => state.nonce === nonce,
    );
    if (currentActiveTabRef.current !== tabsDataRef.current[index].nonce) {
      setTabsNewMessage([
        ...tabsNewMessageRef.current.slice(0, index),
        true,
        ...tabsNewMessageRef.current.slice(index + 1),
      ]);
    }
  };

  const clearTabNewMessageState = (nonce: string) => {
    const index = tabsDataRef.current.findIndex(
      (state) => state.nonce === nonce,
    );
    if (index > -1 && tabsNewMessageRef.current[index]) {
      setTabsNewMessage([
        ...tabsNewMessageRef.current.slice(0, index),
        false,
        ...tabsNewMessageRef.current.slice(index + 1),
      ]);
    }
  };

  useEffect(() => {
    const stopSSHWindowReadyPromise = listen<string>(
      EventIsSSHWindowReady,
      async (ev) => {
        await emit(EventAckSSHWindowReady, ev.payload);
      },
    );
    const stopSSHListenPromise = listen<EventNewSSHPayload>(
      EventNewSSHName,
      newSSHEventListener,
    );

    return () => {
      (async () => {
        (await stopSSHWindowReadyPromise)();
        (await stopSSHListenPromise)();
      })();
    };
  }, []);

  return (
    <>
      <Tabs
        // variant="unstyled"
        // classNames={classes}
        h="100%"
        display="flex"
        style={{
          flexDirection: "column",
        }}
        value={currentActiveTab}
        onChange={(newActive) => {
          setCurrentActiveTab(newActive);
          if (newActive) {
            clearTabNewMessageState(newActive);
          }
        }}
        activateTabWithKeyboard={false}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <Tabs.List pr={rem(40)} data-tauri-drag-region>
          {tabsData.map((tabData, index) => (
            <ShellTab
              key={tabData.nonce}
              data={tabData}
              close={() => {
                closeTab(tabData.nonce);
              }}
              state={tabsState[index]}
              isNewMessage={tabsNewMessage[index]}
            />
          ))}
          <Tabs.Tab value="help" ml="auto">
            Help
          </Tabs.Tab>
        </Tabs.List>

        <Box
          style={{
            flexGrow: 1,
            overflow: "clip",
          }}
        >
          {tabsData.map((tabData) => (
            <ShellPanel
              key={tabData.nonce}
              data={tabData}
              setShellState={(state) => {
                setTabShellState(state, tabData.nonce);
              }}
              setNewMessage={() => {
                setTabNewMessageState(tabData.nonce);
              }}
            />
          ))}
          <Tabs.Panel value="help">Hello</Tabs.Panel>
        </Box>
      </Tabs>

      <TerminateCloseModal
        open={isTerminateConfirmModalOpen}
        onClose={closeTerminateConfirmModal}
        itemName={
          terminateConfirmIndex === -1
            ? ""
            : tabsData[terminateConfirmIndex].name
        }
        confirm={() => {
          closeTerminateConfirmModal();
          setTerminateConfirmIndex(-1);
          doClose(terminateConfirmIndex);
        }}
      />
    </>
  );
};

export default ShellTabs;
