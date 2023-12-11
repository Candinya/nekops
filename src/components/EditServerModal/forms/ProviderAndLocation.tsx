import type { InputFormProps } from "../inputFormProps.ts";
import {
  Autocomplete,
  Fieldset,
  Flex,
  Grid,
  NumberInput,
  SegmentedControl,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";

const ProviderAndLocationForm = ({ form }: InputFormProps) => (
  <>
    <Fieldset legend="Provider">
      <Grid>
        <Grid.Col span={9}>
          <Autocomplete
            label="Provider"
            placeholder="Pick one or enter new"
            data={["A", "B"]} // TODO
            {...form.getInputProps("provider.provider")}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Flex gap="md">
            <Flex direction="column">
              <Text size="sm" fw={500} mb={2}>
                Type
              </Text>
              <SegmentedControl
                data={["VPS", "DS"]}
                {...form.getInputProps("provider.type")}
              />
            </Flex>
            <NumberInput
              label="Monthly Price"
              leftSection={<IconCurrencyDollar />}
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              style={{
                flexGrow: 1,
              }}
              {...form.getInputProps("provider.price")}
            />
          </Flex>
        </Grid.Col>
      </Grid>
      <TextInput
        mt="md"
        label="Product"
        {...form.getInputProps("provider.product")}
      />
    </Fieldset>

    <Fieldset mt="lg" legend="Location">
      <Grid>
        <Grid.Col span={2}>
          <Select
            label="Region"
            data={["A", "B"]}
            searchable
            nothingFoundMessage="No such region"
            {...form.getInputProps("location.region")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Datacenter"
            {...form.getInputProps("location.datacenter")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Host System"
            {...form.getInputProps("location.host_system")}
          />
        </Grid.Col>
      </Grid>
    </Fieldset>
  </>
);

export default ProviderAndLocationForm;