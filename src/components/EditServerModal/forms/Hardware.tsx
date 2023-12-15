import type { InputFormProps } from "../inputFormProps.ts";
import type { Disk } from "@/types/server.ts";
import {
  Accordion,
  Autocomplete,
  Button,
  Center,
  Checkbox,
  Fieldset,
  Flex,
  Grid,
  Group,
  NumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import HDDIcon from "@/assets/hdd.svg";
import SSDIcon from "@/assets/ssd.svg";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";

interface DiskItemProps extends InputFormProps {
  disk: Disk;
  index: number;
}
const DiskItem = ({ disk, index, form }: DiskItemProps) => {
  const itemName =
    `Disk ${index + 1}: ` +
    (disk.count > 1 ? `${disk.count} × ` : "") +
    `${disk.size} ${disk.size_unit} ${disk.type} (${disk.interface})`;
  return (
    <Accordion.Item value={`disk_${index}`}>
      <Center>
        <Accordion.Control
          icon={
            <img
              src={
                disk.type === "HDD"
                  ? HDDIcon
                  : disk.type === "SSD"
                    ? SSDIcon
                    : undefined
              }
              alt={disk.type}
              height={16}
              width={16}
            />
          }
        >
          {itemName}
        </Accordion.Control>
        <DeleteItemButton
          size={"lg"}
          variant={"subtle"}
          itemName={itemName}
          onClick={() => form.removeListItem("hardware.disk", index)}
        />
      </Center>
      <Accordion.Panel>
        <Grid grow>
          <Grid.Col span={2}>
            <NumberInput
              label="Count"
              allowNegative={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              rightSection={<IconX size={16} />}
              min={1}
              {...form.getInputProps(`hardware.disk.${index}.count`)}
            />
          </Grid.Col>
          <Grid.Col span={7}>
            <Group grow gap="md">
              <Flex direction="column">
                <Text size="sm" fw={500} mb={2}>
                  Type
                </Text>
                <SegmentedControl
                  data={["HDD", "SSD"]}
                  {...form.getInputProps(`hardware.disk.${index}.type`)}
                />
              </Flex>
              <Flex direction="column">
                <Text size="sm" fw={500} mb={2}>
                  Interface
                </Text>
                <SegmentedControl
                  data={["SATA", "SAS", "NVMe"]}
                  {...form.getInputProps(`hardware.disk.${index}.interface`)}
                />
              </Flex>
            </Group>
          </Grid.Col>
          <Grid.Col span={3}>
            <Flex gap="sm">
              <NumberInput
                label="Size"
                allowNegative={false}
                decimalScale={2}
                allowLeadingZeros={false}
                {...form.getInputProps(`hardware.disk.${index}.size`)}
              />
              <Flex direction="column">
                <Text size="sm" fw={500} mb={2}>
                  Unit
                </Text>
                <SegmentedControl
                  data={["GB", "TB"]}
                  {...form.getInputProps(`hardware.disk.${index}.size_unit`)}
                />
              </Flex>
            </Flex>
          </Grid.Col>
        </Grid>
        <TextInput
          mt="md"
          label="Model"
          {...form.getInputProps(`hardware.disk.${index}.model`)}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
};

const HardwareForm = ({ form }: InputFormProps) => (
  <>
    <Fieldset legend="CPU">
      <Grid grow>
        <Grid.Col span={1}>
          <NumberInput
            label="Count"
            allowNegative={false}
            allowDecimal={false}
            allowLeadingZeros={false}
            min={1}
            rightSection={<IconX size={16} />}
            {...form.getInputProps("hardware.cpu.count")}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Autocomplete
            label="Manufacturer"
            data={["Intel", "AMD"]}
            {...form.getInputProps("hardware.cpu.manufacturer")}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          <TextInput
            label="Model"
            {...form.getInputProps("hardware.cpu.model")}
          />
        </Grid.Col>
      </Grid>
      <Grid mt="md" grow>
        <Grid.Col span={4}>
          <NumberInput
            label="Cores"
            allowNegative={false}
            allowDecimal={false}
            allowLeadingZeros={false}
            min={1}
            {...form.getInputProps("hardware.cpu.core_count")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="Threads"
            allowNegative={false}
            allowDecimal={false}
            allowLeadingZeros={false}
            min={1}
            {...form.getInputProps("hardware.cpu.thread_count")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="Base Frequency"
            allowNegative={false}
            decimalScale={1}
            allowLeadingZeros={false}
            suffix="GHz"
            {...form.getInputProps("hardware.cpu.base_frequency")}
          />
        </Grid.Col>
      </Grid>
    </Fieldset>
    <Fieldset mt="md" legend="Memory">
      <Grid grow>
        <Grid.Col span={4}>
          <Flex direction="row" gap="xs">
            <NumberInput
              label="Generation"
              allowNegative={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              prefix="DDR"
              style={{
                flexGrow: 1,
              }}
              {...form.getInputProps("hardware.memory.generation")}
            />
            <Flex direction="column" justify="end">
              <Text size="sm" fw={500} mb={1}>
                ECC
              </Text>
              <Checkbox
                size="xl"
                {...form.getInputProps("hardware.memory.ecc")}
              />
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="Size"
            allowNegative={false}
            decimalScale={1}
            allowLeadingZeros={false}
            suffix="GB"
            step={0.5}
            {...form.getInputProps("hardware.memory.size")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="Frequency"
            allowNegative={false}
            allowDecimal={false}
            allowLeadingZeros={false}
            suffix="MHz"
            step={100}
            {...form.getInputProps("hardware.memory.frequency")}
          />
        </Grid.Col>
      </Grid>
    </Fieldset>
    <Fieldset mt="md" legend="Disk">
      <Accordion>
        {form.values.hardware.disk.map((disk: Disk, index: number) => (
          <DiskItem key={index} disk={disk} index={index} form={form} />
        ))}
      </Accordion>
      <Center mt="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() =>
            form.insertListItem("hardware.disk", {
              count: 1,
              type: "SSD",
              interface: "NVMe",
              size: 256,
              size_unit: "GB",
              model: "Generic disk",
            })
          }
        >
          Add
        </Button>
      </Center>
    </Fieldset>
  </>
);

export default HardwareForm;
