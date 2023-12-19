import { IconBusinessplan } from "@tabler/icons-react";
import {
  Box,
  Center,
  Flex,
  Group,
  Paper,
  Progress,
  rem,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";

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

const Billing = () => {
  const servers = useSelector((state: RootState) => state.servers);

  const [billingCount, setBillingCount] = useState(0);

  const [billingCountByType, setBillingCountByType] = useState<SectionData[]>([
    {
      label: "Dedicated Server",
      text: "0",
      part: 50,
      color: "#3b5bdb", // indigo
    },
    {
      label: "Virtual Private Server",
      text: "0",
      part: 50,
      color: "#66a811", // lime
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
      setBillingCount(sum);
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
      console.log(sumProviderArray);
      const colors = ["#37B24D", "#1098AD", "#7048E8", "#F03E3E"];
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
    <Paper withBorder p="md" radius="md">
      <Flex direction="column" gap="xl">
        <Box>
          <Group justify="space-between">
            <Title c="dimmed" order={2} size="h5" fw={700}>
              Monthly billing
            </Title>
            <IconBusinessplan size="1.4rem" stroke={1.5} />
          </Group>

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
              {billingCount.toFixed(2)}
            </Text>
          </Group>
        </Box>

        <BillingSection title="By Server Types" data={billingCountByType} />
        <BillingSection
          title="By Server Providers"
          data={billingCountByProvider}
        />
      </Flex>
    </Paper>
  );
};

export default Billing;
