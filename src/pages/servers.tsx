import { Flex, Table, Text } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

const TableHeader = () => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th rowSpan={2}>Applications</Table.Th>

      <Table.Th rowSpan={2}>Provider</Table.Th>

      <Table.Th colSpan={3}>Physical Location</Table.Th>

      <Table.Th rowSpan={2}>Type</Table.Th>

      <Table.Th rowSpan={2}>Model</Table.Th>

      <Table.Th colSpan={3}>Configurations</Table.Th>

      <Table.Th colSpan={3}>Network</Table.Th>

      <Table.Th rowSpan={2}>Original ID</Table.Th>

      <Table.Th colSpan={2}>IP Allocation</Table.Th>

      <Table.Th rowSpan={2}>Price ($/mo)</Table.Th>

      <Table.Th colSpan={3}>Regular Access (SSH)</Table.Th>

      <Table.Th rowSpan={2}>Net ID</Table.Th>

      <Table.Th colSpan={2}>Private Network</Table.Th>

      <Table.Th colSpan={5}>Emergency Access</Table.Th>
    </Table.Tr>
    <Table.Tr>
      {/*Applications*/}

      {/*Provider*/}

      {/*Physical Location*/}
      <Table.Th>Region</Table.Th>
      <Table.Th>Datacenter</Table.Th>
      <Table.Th>Host System / Rack</Table.Th>

      {/*Type*/}

      {/*Model*/}

      {/*Configurations*/}
      <Table.Th>CPU</Table.Th>
      <Table.Th>Memory</Table.Th>
      <Table.Th>Disk</Table.Th>

      {/*Network*/}
      <Table.Th>Traffic (TB)</Table.Th>
      <Table.Th>Bandwidth (Mbps)</Table.Th>
      <Table.Th>Two-way billing</Table.Th>

      {/*Original ID*/}

      {/*IP Allocation*/}
      <Table.Th>IPv4</Table.Th>
      <Table.Th>IPv6</Table.Th>

      {/*Price ($/mo)*/}

      {/*Regular Access (SSH)*/}
      <Table.Th>Port</Table.Th>
      <Table.Th>User</Table.Th>
      <Table.Th>Private Network Only</Table.Th>

      {/*Net ID*/}

      {/*Private Network*/}
      <Table.Th>IP</Table.Th>
      <Table.Th>Groups</Table.Th>

      {/*Emergency Access*/}
      <Table.Th>root Password</Table.Th>
      <Table.Th>Method</Table.Th>
      <Table.Th>Address</Table.Th>
      <Table.Th>Username</Table.Th>
      <Table.Th>Password</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

interface WrapperProps extends PropsWithChildren {}
const Wrapper = ({ children }: WrapperProps) => (
  <Table.ScrollContainer minWidth={2400} style={{ flex: 1 }}>
    <Table
      stickyHeader
      stickyHeaderOffset={60}
      striped
      highlightOnHover
      withColumnBorders
      h="100%"
    >
      <TableHeader />
      <Table.Tbody>{children}</Table.Tbody>
      {/*<Table.Caption>Total {serverCount} servers.</Table.Caption>*/}
    </Table>
  </Table.ScrollContainer>
);

const Servers = () => {
  const [serverCount, setServerCount] = useState(0);

  useEffect(() => {
    setServerCount(114514);
  }, []);

  return (
    <Flex direction="column">
      <Wrapper></Wrapper>
      <Text size="sm" ta="center" c="dimmed">
        Total {serverCount} servers.
      </Text>
    </Flex>
  );
};

export default Servers;
