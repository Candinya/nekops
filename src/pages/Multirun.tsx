import { Button, Flex, ScrollArea, SimpleGrid, Textarea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import TabsTable from "@/components/multirun/TabsTable.tsx";
import type { Event } from "@tauri-apps/api/event";
import { emit, listen } from "@tauri-apps/api/event";
import {
  EventRequestTabsListName,
  EventResponseTabsListName,
  EventSendCommandByNonceName,
  EventSetActiveTabByNonceName,
} from "@/events/name.ts";
import type {
  EventSendCommandByNoncePayload,
  SSHSingleServer,
} from "@/events/payload.ts";
import { IconSend } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import SnippetsTable from "@/components/multirun/SnippetsTable.tsx";
import { notifications } from "@mantine/notifications";

const MultirunPage = () => {
  const snippets = useSelector((state: RootState) => state.snippets);

  const [selectedTabsNonce, setSelectedTabsNonce] = useState<string[]>([]);
  const [tabs, setTabs] = useState<SSHSingleServer[]>([]);

  const codeInputRef = useRef<HTMLTextAreaElement>(null);

  const setActivatedTabByNonce = (nonce: string) => {
    emit(EventSetActiveTabByNonceName, nonce);
  };

  const requestTabsList = () => {
    emit(EventRequestTabsListName);
  };

  const responseTabsListListener = (ev: Event<SSHSingleServer[]>) => {
    setTabs(ev.payload);
  };

  const setCode = (code: string) => {
    if (codeInputRef.current) {
      codeInputRef.current.value = code;
    }
  };

  const sendCommand = () => {
    if (codeInputRef.current) {
      const sendCommandEventPayload: EventSendCommandByNoncePayload = {
        nonce: selectedTabsNonce,
        command: codeInputRef.current?.value,
      };
      emit(EventSendCommandByNonceName, sendCommandEventPayload);
      notifications.show({
        color: "green",
        title: "Command sent!",
        message: "Feel free to view results in Shell window :D",
      });
    }
  };

  useEffect(() => {
    // Prepare event listener for tabs update
    const stopTabsListPromise = listen<SSHSingleServer[]>(
      EventResponseTabsListName,
      responseTabsListListener,
    );

    // Request for tabs list at startup
    requestTabsList();

    // Stop listen before component (page) destroy
    return () => {
      (async () => {
        (await stopTabsListPromise)();
      })();
    };
  }, []);

  return (
    <>
      <SimpleGrid cols={2} h="100%" p="md">
        {/*Server Table*/}
        <ScrollArea>
          <TabsTable
            tabs={tabs}
            show={setActivatedTabByNonce}
            selectedTabsNonce={selectedTabsNonce}
            setSelectedTabsNonce={setSelectedTabsNonce}
          />
        </ScrollArea>
        <Flex direction="column" h="100%" gap="md">
          {/*Snippets List*/}
          <ScrollArea
            h={0}
            style={{
              flexGrow: 1,
            }}
          >
            <SnippetsTable snippets={snippets} show={setCode} />
          </ScrollArea>

          {/*Code Input*/}
          <Textarea
            ref={codeInputRef}
            autosize
            minRows={6}
            maxRows={10}
            placeholder={"# Codes here...\necho 'Hello Nekops!'"}
          />

          {/*Send*/}
          <Button
            fullWidth
            leftSection={<IconSend size={16} />}
            onClick={sendCommand}
            disabled={selectedTabsNonce.length === 0}
          >
            Send
          </Button>
        </Flex>
      </SimpleGrid>
    </>
  );
};

export default MultirunPage;
