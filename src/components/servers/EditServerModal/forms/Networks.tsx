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
import { defaultIP, IP } from "@/types/server.ts";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import { spaceRegexp } from "@/utils/spaceRegexp.ts";

interface IPItemProps extends InputFormProps {
  ip: IP;
  formListItem: string;
  index: number;
}
const IPItem = ({ ip, formListItem, index, form }: IPItemProps) => {
  const ipCIDR = `${ip.address}/${ip.cidr_prefix}`;
  const itemName =
    `IP ${index + 1}: ` +
    (ip.family === "IPv4" ? ipCIDR : `[${ipCIDR}]`) +
    (ip.comment ? ` - ${ip.comment}` : "");

  const checkIP = (ip: string, index: number) => {
    let newIPValue = ip;
    if (spaceRegexp.test(ip)) {
      newIPValue = ip.replace(spaceRegexp, ""); // Remove all spaces
    }
    if (newIPValue.includes("/")) {
      const [ipAddr, cidr] = newIPValue.split("/");
      form.setFieldValue(
        `${formListItem}.${index}.cidr_prefix`,
        parseInt(cidr),
      );
      newIPValue = ipAddr;
    }
    const containsPoint = newIPValue.includes(".");
    const containsColon = newIPValue.includes(":");
    if (containsPoint && !containsColon) {
      form.setFieldValue(`${formListItem}.${index}.family`, "IPv4");
    } else if (!containsPoint && containsColon) {
      form.setFieldValue(`${formListItem}.${index}.family`, "IPv6");
    } // else we don't know what IP is this, so just skip
    if (newIPValue !== ip) {
      form.setFieldValue(`${formListItem}.${index}.address`, newIPValue);
    }
  };

  return (
    <Accordion.Item value={`ip_${index}`}>
      <Center>
        <Accordion.Control icon={<IconSitemap color="gray" size={16} />}>
          {itemName}
        </Accordion.Control>
        <DeleteItemButton
          size={"lg"}
          variant={"subtle"}
          itemName={itemName}
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
            onBlur={(ev) => checkIP(ev.target.value, index)}
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
          label="Alias (rDNS)"
          mt="md"
          {...form.getInputProps(`${formListItem}.${index}.alias`)}
        />
        <TextInput
          label="Comment"
          mt="md"
          {...form.getInputProps(`${formListItem}.${index}.comment`)}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
};

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
            ...defaultIP,
            alias: `${
              form.values.network[isPrivate ? "private" : "public"].length + 1
            }.${isPrivate ? "private" : "public"}`, // prevent duplicate alias
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
