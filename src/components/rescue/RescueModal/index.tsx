import {
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
import { useTranslation } from "react-i18next";

import type { Server } from "@/types/server.ts";

import Copy from "./Copy.tsx";

interface RescueModalProps {
  isOpen: boolean;
  close: () => void;
  server: Server | null;
  launch: () => void;
}
const RescueModal = ({ isOpen, close, server, launch }: RescueModalProps) => {
  const { t } = useTranslation("main", { keyPrefix: "rescue" });

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      title={
        <>
          {t("modalTitle")} <Code>{server?.name}</Code>
        </>
      }
      size="lg"
      centered
    >
      <Flex direction="column" gap="md">
        {server?.access.emergency.root_password && (
          <Group>
            <PasswordInput
              label={t("modalRootPasswordLabel")}
              value={server.access.emergency.root_password}
              readOnly
              style={{
                flexGrow: 1,
              }}
            />
            <Copy value={server.access.emergency.root_password} />
          </Group>
        )}
        {server?.access.emergency.address && (
          <Group>
            <Flex direction="column">
              <Text size="sm" fw={500} mb={2}>
                {t("modalTypeLabel")}
              </Text>
              {server.access.emergency.method === "Other" ? (
                <Button
                  style={{
                    alignSelf: "end",
                  }}
                >
                  {t("accessType_Other")}
                </Button>
              ) : (
                <Tooltip
                  label={`${t("modalTypeActionLaunch")} ${server.access.emergency.method}`}
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
              )}
            </Flex>
            <TextInput
              label={t("modalAddressLabel")}
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
              label={t("modalUsernameLabel")}
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
              label={t("modalPasswordLabel")}
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
            label={t("modalCommentLabel")}
            value={server?.access.emergency.comment}
            minRows={3}
            autosize
            readOnly
          />
        )}

        {/*Nothing available*/}
        {!server?.access.emergency.root_password &&
          !server?.access.emergency.address &&
          !server?.access.emergency.username &&
          !server?.access.emergency.password &&
          !server?.access.emergency.comment && <Text>{t("modalEmpty")}</Text>}
      </Flex>
    </Modal>
  );
};

export default RescueModal;
