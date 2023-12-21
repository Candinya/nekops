import { ActionIcon, Tabs } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import ShellTerminal from "@/shell/ShellTerminal.tsx";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { EventsNewSSH } from "@/types/crossEvents.ts";

const ShellTabs = () => {
  useEffect(() => {
    const stopListenPromise = listen<EventsNewSSH>("newSSH", (ev) => {
      console.log(ev);
    });
    return () => {
      (async () => {
        (await stopListenPromise)();
      })();
    };
  }, []);

  return (
    <Tabs>
      <Tabs.List data-tauri-drag-region>
        <Tabs.Tab
          value="session-1"
          color="teal"
          rightSection={
            <ActionIcon
              size="xs"
              variant="subtle"
              color="teal"
              onClick={(e) => {
                e.stopPropagation();
                console.log("close");
              }}
            >
              <IconX />
            </ActionIcon>
          }
          component="div"
        >
          Session 1
        </Tabs.Tab>
        <Tabs.Tab value="session-2" component="div">
          Session 2
        </Tabs.Tab>
        <Tabs.Tab value="session-3" component="div">
          Session 2
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="session-1">
        {/*<ShellTerminal user={"root"} address={"nyawrt"} port={22} />*/}
        <ShellTerminal user={""} address={""} port={0} />
      </Tabs.Panel>
      <Tabs.Panel value="session-2">
        <ShellTerminal user={""} address={""} port={0} />
      </Tabs.Panel>
      <Tabs.Panel value="session-3">
        <ShellTerminal user={""} address={""} port={0} />
      </Tabs.Panel>
    </Tabs>
  );
};

export default ShellTabs;
