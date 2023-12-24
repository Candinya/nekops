import { ActionIcon, Box, rem, Tabs, useMantineTheme } from "@mantine/core";
import { IconBell, IconCircleFilled, IconX } from "@tabler/icons-react";
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

  const LeftIcon = isNewMessage ? IconBell : IconCircleFilled;

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
    {/*Production*/}
    {/*<ShellTerminal*/}
    {/*  nonce={data.nonce}*/}
    {/*  user={data.access.user}*/}
    {/*  address={data.access.address}*/}
    {/*  port={data.access.port}*/}
    {/*/>*/}

    {/*Check*/}
    {/*<ShellTerminal user={"root"} address={"nyawrt"} port={22} />*/}
    {/*<ShellTerminal user={"root"} address={"10.0.8.1"} port={22} />*/}
    <ShellTerminal
      nonce={data.nonce}
      user={""}
      address={""}
      port={0}
      setShellState={setShellState}
      setNewMessage={setNewMessage}
    />
  </Tabs.Panel>
);

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

  const closeTab = (toCloseTabIndex: number) => {
    if (toCloseTabIndex != -1) {
      const newTabsLength = tabsData.length - 1;
      setTabsData([
        ...tabsData.slice(0, toCloseTabIndex),
        ...tabsData.slice(toCloseTabIndex + 1),
      ]);
      setTabsState([
        ...tabsState.slice(0, toCloseTabIndex),
        ...tabsState.slice(toCloseTabIndex + 1),
      ]);
      setTabsNewMessage([
        ...tabsNewMessage.slice(0, toCloseTabIndex),
        ...tabsNewMessage.slice(toCloseTabIndex + 1),
      ]);

      if (newTabsLength === 0) {
        // Close window
        Window.getCurrent().close();
      }
    }
  };

  const setTabShellState = (newState: ShellState, index: number) => {
    setTabsState([
      ...tabsState.slice(0, index),
      newState,
      ...tabsState.slice(index + 1),
    ]);
  };

  const setTabNewMessageState = (index: number) => {
    if (currentActiveTabRef.current !== tabsData[index].nonce) {
      setTabsNewMessage([
        ...tabsNewMessage.slice(0, index),
        true,
        ...tabsNewMessage.slice(index + 1),
      ]);
    }
  };

  const clearTabNewMessageState = (nonce: string | null) => {
    if (nonce) {
      const index = tabsData.findIndex((state) => state.nonce === nonce);
      if (index > -1 && tabsNewMessage[index]) {
        setTabsNewMessage([
          ...tabsNewMessage.slice(0, index),
          false,
          ...tabsNewMessage.slice(index + 1),
        ]);
      }
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
        clearTabNewMessageState(newActive);
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
              closeTab(index);
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
        {tabsData.map((tabData, index) => (
          <ShellPanel
            key={tabData.nonce}
            data={tabData}
            setShellState={(state) => {
              setTabShellState(state, index);
            }}
            setNewMessage={() => {
              setTabNewMessageState(index);
            }}
          />
        ))}
        <Tabs.Panel value="help">Hello</Tabs.Panel>
      </Box>
    </Tabs>
  );
};

export default ShellTabs;
