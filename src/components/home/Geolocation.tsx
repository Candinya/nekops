import type { Server } from "@/types/server.ts";
import {
  Box,
  Card,
  Flex,
  Group,
  Progress,
  rem,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconBuilding, IconMapPin } from "@tabler/icons-react";

type LocationAndCount = {
  region: string;
  count: number;
};

interface CountByRegionProps {
  servers: Server[];
}
const RegionCard = ({ servers }: CountByRegionProps) => {
  const theme = useMantineTheme();

  const [locationCount, setLocationCount] = useState<LocationAndCount[]>([]);

  useEffect(() => {
    const locntsMap = new Map<string, number>();
    for (const server of servers) {
      locntsMap.set(
        server.location.region,
        (locntsMap.get(server.location.region) || 0) + 1,
      );
    }
    const locntsArray: LocationAndCount[] = [];
    for (const [loc, cnt] of locntsMap.entries()) {
      locntsArray.push({
        region: loc,
        count: cnt,
      });
    }
    locntsArray.sort((a, b) => b.count - a.count);
    setLocationCount(locntsArray);
  }, [servers]);

  const predefinedColors = [
    theme.colors.red[6],
    theme.colors.grape[6],
    theme.colors.indigo[6],
    theme.colors.cyan[6],
    theme.colors.green[6],
    theme.colors.yellow[6],

    theme.colors.pink[6],
    theme.colors.violet[6],
    theme.colors.blue[6],
    theme.colors.teal[6],
    theme.colors.lime[6],
    theme.colors.orange[6],
  ];

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
      <IconMapPin
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
              DataCenter Regions
            </Title>

            <Group>
              <IconBuilding size={36} color={theme.colors.teal[6]} />
              <Text
                fw={700}
                style={{
                  fontSize: rem(36),
                }}
              >
                {locationCount.length}
              </Text>
            </Group>
          </Box>
        </Group>

        <Box>
          <Title c="dimmed" order={3} size="h6">
            Server count by Region
          </Title>

          <Progress.Root size={34} mt={16}>
            {locationCount.map((segment, index) => (
              <Tooltip
                key={segment.region}
                label={segment.region}
                withArrow
                arrowSize={6}
              >
                <Progress.Section
                  value={(segment.count / servers.length) * 100}
                  color={predefinedColors[index % predefinedColors.length]}
                />
              </Tooltip>
            ))}
          </Progress.Root>

          <SimpleGrid
            cols={{
              base: 1,
              xs: 2,
              md: 4,
            }}
            mt="md"
          >
            {locationCount.map((segment, index) => (
              <Box
                key={segment.region}
                pb={rem("5px")}
                style={{
                  borderBottom: `${rem("3px")} solid ${
                    predefinedColors[index % predefinedColors.length]
                  }`,
                }}
              >
                <Text fz="xs" c="dimmed" fw={700}>
                  {segment.region}
                </Text>

                <Group justify="space-between" align="flex-end" gap={0}>
                  <Text fw={700}>{segment.count}</Text>
                  <Text
                    c={predefinedColors[index % predefinedColors.length]}
                    fw={700}
                    size="sm"
                  >
                    {((segment.count / servers.length) * 100).toFixed(1)}%
                  </Text>
                </Group>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Card>
  );
};

interface GeneralStaticsProps {
  servers: Server[];
}
const Geolocation = ({ servers }: GeneralStaticsProps) => (
  <Flex direction="column" gap="md">
    <RegionCard servers={servers} />
  </Flex>
);

export default Geolocation;
