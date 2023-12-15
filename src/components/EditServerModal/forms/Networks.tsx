import type { InputFormProps } from "../inputFormProps.ts";
import {
  Accordion,
  Button,
  Center,
  Fieldset,
  Flex,
  Group,
  NumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconSitemap } from "@tabler/icons-react";
import type { IP } from "@/types/server.ts";
import AccordionDeleteItemButton from "@/components/AccordionDeleteItemButton.tsx";

interface IPItemProps extends InputFormProps {
  ip: IP;
  formListItem: string;
  index: number;
}
const IPItem = ({ ip, formListItem, index, form }: IPItemProps) => (
  <Accordion.Item value={`ip_${index}`}>
    <Center>
      <Accordion.Control icon={<IconSitemap color="gray" size={16} />}>
        IP {index + 1}:{" "}
        {ip.family === "IPv4"
          ? `${ip.address}/${ip.cidr_prefix}`
          : `[${ip.address}/${ip.cidr_prefix}]`}{" "}
        - {ip.comment}
      </Accordion.Control>
      <AccordionDeleteItemButton
        onClick={() => form.removeListItem(formListItem, index)}
      />
    </Center>
    <Accordion.Panel>
      <Group>
        <TextInput
          label="IP Address"
          style={{
            flexGrow: 1,
          }}
          {...form.getInputProps(`${formListItem}.${index}.address`)}
        />
        <NumberInput
          label="CIDR Prefix"
          leftSection="/"
          allowNegative={false}
          allowDecimal={false}
          allowLeadingZeros={false}
          {...form.getInputProps(`${formListItem}.${index}.cidr_prefix`)}
        />
        <Flex direction="column">
          <Text size="sm" fw={500} mb={2}>
            Family
          </Text>
          <SegmentedControl
            data={["IPv4", "IPv6"]}
            {...form.getInputProps(`${formListItem}.${index}.family`)}
          />
        </Flex>
      </Group>
      <TextInput
        label="Comment"
        mt="md"
        {...form.getInputProps(`${formListItem}.${index}.comment`)}
      />
    </Accordion.Panel>
  </Accordion.Item>
);

interface NetworkIPGroupProps extends InputFormProps {
  isPrivate: boolean;
  mt?: string;
}
const NetworkIPGroup = ({ isPrivate, mt, form }: NetworkIPGroupProps) => (
  <Fieldset mt={mt} legend={`${isPrivate ? "Private" : "Public"} Network`}>
    <Accordion>
      {form.values.network[isPrivate ? "private" : "public"].map(
        (ip: IP, index: number) => (
          <IPItem
            key={index}
            ip={ip}
            formListItem={`network.${isPrivate ? "private" : "public"}`}
            index={index}
            form={form}
          />
        ),
      )}
    </Accordion>
    <Center mt="md">
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() =>
          form.insertListItem(`network.${isPrivate ? "private" : "public"}`, {
            address: "0.0.0.0",
            cidr_prefix: 32,
            family: "IPv4",
            comment: "Change me",
          })
        }
      >
        Add
      </Button>
    </Center>
  </Fieldset>
);

const NetworksForm = ({ form }: InputFormProps) => (
  <>
    <NetworkIPGroup isPrivate={false} form={form} />
    <NetworkIPGroup isPrivate={true} mt="md" form={form} />
  </>
);

export default NetworksForm;
