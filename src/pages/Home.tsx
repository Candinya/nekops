import { Box, Divider, ScrollArea } from "@mantine/core";
import GeneralCounts from "@/components/home/GeneralCounts.tsx";
import Billing from "@/components/home/Billing.tsx";

const HomePage = () => (
  <Box h="100%">
    <ScrollArea p="md" h="100%">
      <GeneralCounts />

      <Divider my="lg" variant="dashed" opacity={30} label="Geo Location" />

      <Divider my="lg" variant="dashed" opacity={30} label="Billing" />

      <Billing />
    </ScrollArea>
  </Box>
);

export default HomePage;
