import type { Server } from "@/types/server.ts";
import { Box, Card, Flex, Text, Title } from "@mantine/core";
import { IconServer } from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";

import CPU from "@/icons/CPU.tsx";
import RAM from "@/icons/RAM.tsx";

interface ServerCardProps {
  server: Server;
  onClick?: () => void;
}
const ServerCard = ({ server, onClick }: ServerCardProps) => {
  const { hovered, ref } = useHover();
  return (
    <Card
      shadow={Boolean(onClick) && hovered ? "lg" : "sm"}
      radius="md"
      withBorder
      h="12rem"
      style={{
        cursor: Boolean(onClick) ? "pointer" : undefined,
        transition: "all .2s",
      }}
      onClick={onClick}
      ref={ref}
    >
      <Box
        bg={server.color}
        style={{
          height: "24rem",
          width: "24rem",
          borderRadius: "24rem",
          justifyContent: "center",
          position: "absolute",
          right: "-9rem",
          bottom: "-9rem",
        }}
      />
      <IconServer
        size="10rem"
        color="white"
        opacity="30%"
        style={{
          position: "absolute",
          bottom: "-0.5rem",
          right: "0rem",
        }}
      />
      <Flex
        justify="space-between"
        direction="column"
        h="100%"
        ml=".5rem"
        w="calc(100% - 16rem)"
      >
        <Title order={2} size="h1">
          {server.name}
        </Title>
        <Flex direction="column">
          <Flex gap="md" opacity="80%">
            <Flex gap={6}>
              <CPU
                width={24}
                height={24}
                style={{
                  flexShrink: 0,
                }}
              />
              <Text>
                {server.hardware.cpu.count * server.hardware.cpu.core_count}C
                {server.hardware.cpu.count * server.hardware.cpu.thread_count}T
              </Text>
            </Flex>
            <Flex gap={6}>
              <RAM
                width={18}
                height={24}
                style={{
                  flexShrink: 0,
                }}
              />
              <Text>{server.hardware.memory.size}GB</Text>
            </Flex>
          </Flex>
          <Flex gap="md">
            <Text>
              {server.network.private.length > 0
                ? server.network.private[0].address
                : server.network.public.length > 0
                  ? server.network.public[0].address
                  : ""}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ServerCard;
