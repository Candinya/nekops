import type { Server } from "@/types/server.ts";
import { Modal, Paper, ScrollArea, Text } from "@mantine/core";
import ServerCard from "@/components/ServerCard.tsx";

interface ServerCardModalProps {
  isOpen: boolean;
  close: () => void;
  serverInfo?: Server;
}
const ServerCardModal = ({
  isOpen,
  close,
  serverInfo,
}: ServerCardModalProps) => (
  <Modal
    title="Server Card"
    size="lg"
    radius="md"
    opened={isOpen}
    onClose={close}
    centered
    scrollAreaComponent={ScrollArea.Autosize}
  >
    {serverInfo && <ServerCard server={serverInfo} />}
    {serverInfo?.comment && (
      <Paper mt="md" shadow="xs" p="xl" radius="md" withBorder>
        <Text
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {serverInfo.comment}
        </Text>
      </Paper>
    )}
  </Modal>
);

export default ServerCardModal;
