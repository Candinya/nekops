import {
  IconCodeAsterix,
  IconLock,
  IconLockOpen,
  IconLockOpenOff,
  IconServer,
} from "@tabler/icons-react";
import type { RingProgressSection } from "@mantine/core";
import {
  Center,
  Group,
  Paper,
  rem,
  RingProgress,
  SimpleGrid,
  Text,
} from "@mantine/core";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Server } from "@/types/server.ts";
import type { Snippet } from "@/types/snippet.ts";
import type { EncryptionState } from "@/types/encryption.ts";

interface StatCardProps {
  Icon: (props: any) => ReactNode;
  sections: RingProgressSection[];
  label: string;
  stats: string | number;
}
const StatCard = ({ Icon, sections, label, stats }: StatCardProps) => (
  <Paper withBorder radius="md" p="xs">
    <Group>
      <RingProgress
        size={80}
        // roundCaps
        thickness={8}
        sections={sections}
        label={
          <Center>
            <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </Center>
        }
      />

      <div>
        <Text c="dimmed" size="md" fw={700}>
          {label}
        </Text>
        <Text fw={700} size={rem(30)}>
          {stats}
        </Text>
      </div>
    </Group>
  </Paper>
);

interface GeneralStaticsProps {
  servers: Server[];
  snippets: Snippet[];
  encryption: EncryptionState;
}
const GeneralStatics = ({
  servers,
  snippets,
  encryption,
}: GeneralStaticsProps) => {
  const { t } = useTranslation("main", { keyPrefix: "analysis" });

  const [serversCountDS, setServersCountDS] = useState(0);
  const [serversCountVPS, setServersCountVPS] = useState(0);
  const [serversCount, setServersCount] = useState(0);
  const [snippetsCount, setSnippetsCount] = useState(0);

  useEffect(() => {
    if (servers.length > 0) {
      setServersCountDS(
        servers.filter((server) => server.provider.type === "DS").length,
      );
      setServersCountVPS(
        servers.filter((server) => server.provider.type === "VPS").length,
      );
      setServersCount(servers.length);
    }
  }, [servers]);

  useEffect(() => {
    setSnippetsCount(snippets.length);
  }, [snippets]);

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }}>
      <StatCard
        Icon={IconServer}
        label={t("generalServers")}
        sections={[
          {
            color: "indigo.6",
            value:
              (serversCount === 0 ? 0.5 : serversCountDS / serversCount) * 100,
            tooltip: (
              <Text>
                {t("billingDS")} : {serversCountDS}
              </Text>
            ),
          },
          {
            color: "lime.6",
            value:
              (serversCount === 0 ? 0.5 : serversCountVPS / serversCount) * 100,
            tooltip: (
              <Text>
                {t("billingVPS")} : {serversCountVPS}
              </Text>
            ),
          },
        ]}
        stats={serversCount}
      />
      <StatCard
        Icon={IconCodeAsterix}
        sections={[
          {
            color: "orange",
            value: 100,
          },
        ]}
        label={t("generalSnippets")}
        stats={snippetsCount}
      />
      <StatCard
        Icon={
          encryption.isEncryptionEnabled
            ? encryption.isUnlocked
              ? IconLockOpen
              : IconLock
            : IconLockOpenOff
        }
        sections={[
          {
            value: 100,
            ...(encryption.isEncryptionEnabled
              ? encryption.isUnlocked
                ? {
                    color: "yellow",
                    tooltip: t("generalEncryptionMessage_unlocked"),
                  }
                : {
                    color: "green",
                    tooltip: t("generalEncryptionMessage_enabled"),
                  }
              : {
                  color: "red",
                  tooltip: t("generalEncryptionMessage_disabled"),
                }),
          },
        ]}
        label={t("generalEncryption")}
        stats={
          encryption.isEncryptionEnabled
            ? encryption.isUnlocked
              ? t("generalEncryptionState_unlocked")
              : t("generalEncryptionState_enabled")
            : t("generalEncryptionState_disabled")
        }
      />
    </SimpleGrid>
  );
};

export default GeneralStatics;
