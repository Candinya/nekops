import { Box, Divider, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store.ts";
import GeneralStatics from "@/components/analysis/GeneralStatics.tsx";
import Geolocation from "@/components/analysis/Geolocation.tsx";
import Billing from "@/components/analysis/Billing.tsx";

const AnalysisPage = () => {
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

        <Geolocation servers={servers} />

        <Divider my="lg" variant="dashed" opacity={30} label="Billing" />

        <Billing servers={servers} />
      </ScrollArea>
    </Box>
  );
};

export default AnalysisPage;