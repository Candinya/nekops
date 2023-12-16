import { Flex, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import ServerCard from "@/components/ServerCard.tsx";

const SSH = () => {
  const servers = useSelector((state: RootState) => state.servers);
  return (
    <ScrollArea h="100%">
      <Flex p="md" direction="column" gap="md">
        {servers.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            onClick={() => {
              let command = `ssh ${server.access.regular.user}@${server.access.regular.address}`;
              if (server.access.regular.port !== 22) {
                // Is not default SSH port
                command += ` -p ${server.access.regular.port}`;
              }
              console.log(command);
            }}
          />
        ))}
      </Flex>
    </ScrollArea>
  );
};

export default SSH;
