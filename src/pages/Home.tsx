import { Box, Divider, ScrollArea } from "@mantine/core";
import GeneralStatics from "@/components/home/GeneralStatics.tsx";
import Billing from "@/components/home/Billing.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";

const HomePage = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const snippets = useSelector((state: RootState) => state.snippets);
  const encryption = useSelector((state: RootState) => state.encryption);

  return (
    <Box h="100%">
      <ScrollArea p="md" h="100%">
        <GeneralStatics
          servers={servers}
          snippets={snippets}
          encryption={encryption}
        />

        <Divider my="lg" variant="dashed" opacity={30} label="Geo Location" />

        <Divider my="lg" variant="dashed" opacity={30} label="Billing" />

        <Billing servers={servers} />
      </ScrollArea>
    </Box>
  );
};

export default HomePage;
