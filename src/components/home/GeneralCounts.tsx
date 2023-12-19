import {
  IconCodeAsterix,
  IconLock,
  IconLockOpen,
  IconLockOpenOff,
  IconServer,
  TablerIconsProps,
} from "@tabler/icons-react";
import type { DefaultMantineColor } from "@mantine/core";
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
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";

interface Section {
  color: DefaultMantineColor;
  value: number;
  tooltip?: ReactNode;
}

interface StatCardProps {
  Icon: (props: TablerIconsProps) => ReactNode;
  sections: Section[];
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
        <Text c="dimmed" size="sm" fw={700}>
          {label}
        </Text>
        <Text fw={700} size="xl">
          {stats}
        </Text>
      </div>
    </Group>
  </Paper>
);

const GeneralCounts = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const snippets = useSelector((state: RootState) => state.snippets);
  const encryption = useSelector((state: RootState) => state.encryption);

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
        label="Servers"
        sections={[
          {
            color: "indigo",
            value:
              (serversCount === 0 ? 0.5 : serversCountDS / serversCount) * 100,
            tooltip: <Text>Dedicated Server : {serversCountDS}</Text>,
          },
          {
            color: "lime",
            value:
              (serversCount === 0 ? 0.5 : serversCountVPS / serversCount) * 100,
            tooltip: <Text>Virtual Private Servers : {serversCountVPS}</Text>,
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
        label="Snippets"
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
                    tooltip: "Keep unlocked before program restarts",
                  }
                : {
                    color: "green",
                    tooltip: "Your data has been locked safely",
                  }
              : {
                  color: "red",
                  tooltip: "Your data might in danger",
                }),
          },
        ]}
        label="Encryption"
        stats={
          encryption.isEncryptionEnabled
            ? encryption.isUnlocked
              ? "Unlocked"
              : "Enabled"
            : "Disabled"
        }
      />
    </SimpleGrid>
  );
};

export default GeneralCounts;
