import { ActionIcon, rem, Tabs } from "@mantine/core";
import { IconBell, IconX } from "@tabler/icons-react";
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

interface ShellTabProps {
  data: EventNewSSHPayload;
  close: () => void;
}
const ShellTab = ({ data, close }: ShellTabProps) => (
  <Tabs.Tab
    value={data.nonce}
    color={data.color}
    leftSection={<IconBell size={14} />}
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

interface ShellPanelProps {
  data: EventNewSSHPayload;
}
const ShellPanel = ({ data }: ShellPanelProps) => (
  <Tabs.Panel value={data.nonce}>
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
    <ShellTerminal nonce={data.nonce} user={""} address={""} port={0} />
  </Tabs.Panel>
);

const ShellTabs = () => {
  // For components render
  const [tabsData, setTabsData] = useState<EventNewSSHPayload[]>([]);
  // For events binding
  const tabsDataRef = useRef<EventNewSSHPayload[]>([]);
  // Bind state : setTabsData -> tabsData -> tabsDataRef
  useEffect(() => {
    tabsDataRef.current = tabsData;
  }, [tabsData]);

  const [currentActiveTab, setCurrentActiveTag] = useState<string | null>(null);

  const newSSHEventListener = (ev: Event<EventNewSSHPayload>) => {
    setTabsData(tabsDataRef.current.concat(ev.payload));
    setCurrentActiveTag(ev.payload.nonce);
  };

  const closeTab = (nonce: string) => {
    const toCloseTabIndex = tabsData.findIndex((tab) => tab.nonce === nonce);
    if (toCloseTabIndex != -1) {
      const newTabsState = [
        ...tabsData.slice(0, toCloseTabIndex),
        ...tabsData.slice(toCloseTabIndex + 1),
      ];
      setTabsData(newTabsState);

      if (newTabsState.length === 0) {
        // Close window
        Window.getCurrent().close();
      }
    }
  };

  useEffect(() => {
    console.log("start");
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
      value={currentActiveTab}
      onChange={setCurrentActiveTag}
      activateTabWithKeyboard={false}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Tabs.List pr={rem(40)} data-tauri-drag-region>
        {tabsData.map((data) => (
          <ShellTab
            key={data.nonce}
            data={data}
            close={() => {
              closeTab(data.nonce);
            }}
          />
        ))}
        <Tabs.Tab value="help" ml="auto">
          Help
        </Tabs.Tab>
      </Tabs.List>

      {tabsData.map((data) => (
        <ShellPanel key={data.nonce} data={data} />
      ))}
      <Tabs.Panel value="help">Hello</Tabs.Panel>
    </Tabs>
  );
};

export default ShellTabs;
