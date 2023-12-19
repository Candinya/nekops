import { Box, Divider, ScrollArea } from "@mantine/core";
import GeneralStatics from "@/components/home/GeneralStatics.tsx";
import Billing from "@/components/home/Billing.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";

const HomePage = () => {
  const state = useSelector((state: RootState) => state);
  const servers = useSelector((state: RootState) => state.servers);

  return (
    <Box h="100%">
      <ScrollArea p="md" h="100%">
        <GeneralStatics state={state} />

        <Divider my="lg" variant="dashed" opacity={30} label="Geo Location" />

        <Divider my="lg" variant="dashed" opacity={30} label="Billing" />

        <Billing servers={servers} />
      </ScrollArea>
    </Box>
  );
};

export default HomePage;
