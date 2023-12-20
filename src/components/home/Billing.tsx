import { IconBusinessplan } from "@tabler/icons-react";
import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  Progress,
  rem,
  SimpleGrid,
  Table,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import type { Server } from "@/types/server.ts";

interface SectionData {
  label: string;
  text: string;
  part: number;
  color: string;
}
interface BillingSectionProps {
  title: string;
  data: SectionData[];
}
const BillingSection = ({ title, data }: BillingSectionProps) => (
  <Box>
    <Title c="dimmed" order={3} size="h6">
      {title}
    </Title>

    <Progress.Root size={34} mt={16}>
      {data.map((segment) => (
        <Tooltip
          key={segment.label}
          label={
            <>
              <Center>
                <Text>{segment.label}</Text>
              </Center>
              <Center>
                <Text size="xs">{segment.part.toFixed(1)}%</Text>
              </Center>
            </>
          }
          withArrow
          arrowSize={6}
        >
          <Progress.Section
            key={segment.label}
            value={segment.part}
            color={segment.color}
          />
        </Tooltip>
      ))}
    </Progress.Root>

    <SimpleGrid
      cols={{
        base: 1,
        xs: data.length >= 2 ? 2 : data.length,
        md: data.length,
      }}
      mt="md"
    >
      {data.map((segment) => (
        <Box
          key={segment.label}
          pb={rem("5px")}
          style={{
            borderBottom: `${rem("3px")} solid ${segment.color}`,
          }}
        >
          <Text fz="xs" c="dimmed" fw={700}>
            {segment.label}
          </Text>

          <Group justify="space-between" align="flex-end" gap={0}>
            <Text fw={700}>${segment.text}</Text>
            <Text c={segment.color} fw={700} size="sm">
              {segment.part.toFixed(1)}%
            </Text>
          </Group>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

interface BillingCardProps {
  servers: Server[];
}
const BillingCard = ({ servers }: BillingCardProps) => {
  const theme = useMantineTheme();
  const [billingSum, setBillingSum] = useState(0);
  const [billingCountByType, setBillingCountByType] = useState<SectionData[]>([
    {
      label: "Dedicated Server",
      text: "0",
      part: 50,
      color: theme.colors.indigo[6], // indigo
    },
    {
      label: "Virtual Private Server",
      text: "0",
      part: 50,
      color: theme.colors.lime[6], // lime
    },
  ]);
  const [billingCountByProvider, setBillingCountByProvider] = useState<
    SectionData[]
  >([]);

  useEffect(() => {
    if (servers.length > 0) {
      // Count by type
      let sumDS = 0;
      let sumVPS = 0;

      // Count by provider
      const sumProviderMap = new Map<string, number>();

      for (const server of servers) {
        // Count by type
        if (server.provider.type === "DS") {
          sumDS += server.provider.price;
        } else if (server.provider.type === "VPS") {
          sumVPS += server.provider.price;
        }
        // Count by provider
        sumProviderMap.set(
          server.provider.name,
          (sumProviderMap.get(server.provider.name) || 0) +
            server.provider.price,
        );
      }
      const sum = sumDS + sumVPS;
      setBillingSum(sum);
      // Count by type
      setBillingCountByType([
        {
          label: "Dedicated Server",
          text: sumDS.toFixed(2),
          part: (sumDS / sum) * 100,
          color: "#3b5bdb", // indigo
        },
        {
          label: "Virtual Private Server",
          text: sumVPS.toFixed(2),
          part: (sumVPS / sum) * 100,
          color: "#66a811", // lime
        },
      ]);

      // Count by provider
      const sumProviderArray = [];
      for (const [provider, priceSum] of sumProviderMap.entries()) {
        sumProviderArray.push({
          provider,
          priceSum,
        });
      }
      sumProviderArray.sort((a, b) => b.priceSum - a.priceSum);
      const colors = [
        theme.colors.green[6],
        theme.colors.cyan[6],
        theme.colors.violet[6],
        theme.colors.pink[6],
      ];
      let i = 0;
      const countByProviderPending: SectionData[] = [];
      for (; i < colors.length - 1 && i < sumProviderArray.length - 1; i++) {
        countByProviderPending.push({
          label: sumProviderArray[i].provider,
          text: sumProviderArray[i].priceSum.toFixed(2),
          part: (sumProviderArray[i].priceSum / sum) * 100,
          color: colors[i],
        });
      }
      // Merge all remains into one "Others"
      let othersSum = 0;
      for (let j = i; j < sumProviderArray.length; j++) {
        othersSum += sumProviderArray[i].priceSum;
      }
      countByProviderPending.push({
        label: "Others",
        text: othersSum.toFixed(2),
        part: (othersSum / sum) * 100,
        color: colors[i],
      });
      setBillingCountByProvider(countByProviderPending);
    }
  }, [servers]);

  return (
    <Card withBorder p="md" radius="md">
      <Box
        bg="#62b6e7"
        style={{
          height: rem(16 * 16),
          width: rem(16 * 16),
          borderRadius: rem(16 * 16),
          justifyContent: "center",
          position: "absolute",
          right: rem(-6.5 * 16),
          top: rem(-6.5 * 16),
        }}
      />
      <IconBusinessplan
        color="white"
        opacity="30%"
        style={{
          width: rem(6 * 16),
          height: rem(6 * 16),
          position: "absolute",
          top: rem(0.5 * 16),
          right: rem(0.5 * 16),
        }}
      />
      <Flex direction="column" gap="xl">
        <Group justify="space-between">
          <Box>
            <Title c="dimmed" order={3} size="h5" fw={700}>
              Monthly billing
            </Title>

            <Group gap={rem(8)}>
              <Text
                c="teal"
                fw={700}
                style={{
                  fontSize: rem(36),
                }}
              >
                $
              </Text>
              <Text
                fw={700}
                style={{
                  fontSize: rem(36),
                }}
              >
                {billingSum.toFixed(2)}
              </Text>
            </Group>
          </Box>
        </Group>

        <BillingSection title="By Server Types" data={billingCountByType} />
        <BillingSection
          title="By Server Providers"
          data={billingCountByProvider}
        />
      </Flex>
    </Card>
  );
};

interface MostValuableServersProps {
  servers: Server[];
  limit: number;
}
const MostValuableServers = ({ servers, limit }: MostValuableServersProps) => {
  const [MVS, setMVS] = useState<Server[]>([]);
  const [MVSPriceSum, setMVSPriceSum] = useState(0);

  useEffect(() => {
    if (servers.length > 0) {
      let sum = 0;
      const serverSortByPrice: Server[] = servers.map((s) => s); // `servers` state is read-only, so let's make a sortable copy
      serverSortByPrice.sort((a, b) => b.provider.price - a.provider.price); // Could use toSorted() on new browsers, but using sort() is safer
      const mvs = serverSortByPrice.slice(0, limit);
      for (const valuableServer of mvs) {
        sum += valuableServer.provider.price;
      }
      setMVS(mvs);
      setMVSPriceSum(sum);
    }
  }, [servers]);

  return (
    <Card withBorder p="md" radius="md">
      <Title c="dimmed" order={3} size="h5" fw={700}>
        Top {limit} valuable servers
      </Title>

      <Table mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Server Name</Table.Th>
            <Table.Th>Provider</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {MVS.map((server) => (
            <Table.Tr key={server.id}>
              <Table.Td>{server.name}</Table.Td>
              <Table.Td>{server.provider.name}</Table.Td>
              <Table.Td>{server.provider.type}</Table.Td>
              <Table.Td>${server.provider.price.toFixed(2)}</Table.Td>
              <Table.Td width="20%">
                <Progress.Root>
                  <Progress.Section
                    value={(server.provider.price / MVSPriceSum) * 100}
                    color="teal"
                  />
                </Progress.Root>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
};

interface BillingProps {
  servers: Server[];
}
const Billing = ({ servers }: BillingProps) => (
  <Flex direction="column" gap="md">
    <BillingCard servers={servers} />
    <MostValuableServers servers={servers} limit={5} />
  </Flex>
);

export default Billing;
