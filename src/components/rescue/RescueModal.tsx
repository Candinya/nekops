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
import { IconClipboardCheck, IconClipboardCopy } from "@tabler/icons-react";
import type { Server } from "@/types/server.ts";
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
            value={server?.access.emergency.root_password}
            readOnly
            style={{
              flexGrow: 1,
            }}
          />
          <Copy value={server?.access.emergency.root_password} />
        </Group>
      )}
      {server?.access.emergency.address && (
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
                onClick={launch}
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
