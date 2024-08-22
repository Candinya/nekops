import {
  ActionIcon,
  Button,
  Code,
  Flex,
  Group,
  Modal,
  PasswordInput,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconClipboardCheck,
  IconClipboardCopy,
  IconKeyboard,
} from "@tabler/icons-react";
import type { Server } from "@/types/server.ts";
import CopyButton from "@/components/CopyButton.tsx";
import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

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

interface KeyboardProps {
  text: string;
}
const Keyboard = ({ text }: KeyboardProps) => {
  const [inputCountdown, setInputCountdown] = useState(0);

  const increaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const releaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const increase = () => {
    setInputCountdown(3); // Set minimal count
    if (releaseIntervalRef.current !== null) {
      clearInterval(releaseIntervalRef.current);
    }
    increaseIntervalRef.current = setInterval(() => {
      setInputCountdown((currentCount) => currentCount + 1);
    }, 1000);
  };

  const finishCountDown = () => {
    // Stop current interval
    if (releaseIntervalRef.current !== null) {
      clearInterval(releaseIntervalRef.current);
      releaseIntervalRef.current = null;
    }
    // Trigger keyboard event
    invoke("keyboard_text", {
      text,
    });
  };

  const release = () => {
    if (increaseIntervalRef.current !== null) {
      clearInterval(increaseIntervalRef.current);
    }
    releaseIntervalRef.current = setInterval(() => {
      setInputCountdown((currentCount) => {
        if (currentCount > 0) {
          return currentCount - 1;
        } else {
          finishCountDown();
          return 0;
        }
      });
    }, 1000);
  };

  return (
    <Tooltip label="Input" openDelay={500}>
      <ActionIcon
        size="lg"
        color="green"
        style={{
          alignSelf: "end",
        }}
        onMouseDown={increase}
        onMouseUp={release}
      >
        {inputCountdown || <IconKeyboard />}
      </ActionIcon>
    </Tooltip>
  );
};

interface RescueModalProps {
  isOpen: boolean;
  close: () => void;
  server: Server | null;
  launch: () => void;
}
const RescueModal = ({ isOpen, close, server, launch }: RescueModalProps) => (
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
            value={server.access.emergency.root_password}
            readOnly
            style={{
              flexGrow: 1,
            }}
          />
          <Copy value={server.access.emergency.root_password} />
          <Keyboard text={server.access.emergency.root_password} />
        </Group>
      )}
      {server?.access.emergency.address && (
        <Group>
          <Flex direction="column">
            <Text size="sm" fw={500} mb={2}>
              Type
            </Text>
            <Tooltip
              label={`Launch ${server.access.emergency.method}`}
              openDelay={500}
            >
              <Button
                onClick={launch}
                style={{
                  alignSelf: "end",
                }}
              >
                {server.access.emergency.method}
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
      )}
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

export default RescueModal;
