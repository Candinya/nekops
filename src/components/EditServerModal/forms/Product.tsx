import type { InputFormProps } from "../inputFormProps.ts";
import {
  Autocomplete,
  Checkbox,
  Fieldset,
  Flex,
  Grid,
  NumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";

interface ProductFormProps extends InputFormProps {
  knownProviders: string[];
  knownRegions: string[];
}
const ProductForm = ({
  form,
  knownProviders,
  knownRegions,
}: ProductFormProps) => (
  <>
    <Fieldset legend="Provider">
      <Grid>
        <Grid.Col span={9}>
          <Autocomplete
            label="Provider"
            placeholder="Pick one or enter new"
            data={knownProviders}
            {...form.getInputProps("provider.name")}
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

    <Fieldset mt="lg" legend="Traffic">
      <Grid>
        <Grid.Col span={6}>
          <Flex gap="md">
            <NumberInput
              label="Traffic Limit"
              decimalScale={3}
              allowNegative={false}
              suffix="TB"
              style={{
                flexGrow: 1,
              }}
              {...form.getInputProps("traffic.limit")}
            />
            <Flex direction="column" justify="end">
              <Text size="sm" fw={500} mb={1}>
                Double Rate
              </Text>
              <Checkbox
                size="xl"
                {...form.getInputProps("traffic.double_rate", {
                  type: "checkbox",
                })}
              />
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Bandwidth"
            allowDecimal={false}
            allowNegative={false}
            suffix="Mbps"
            style={{
              flexGrow: 1,
            }}
            {...form.getInputProps("traffic.bandwidth")}
          />
        </Grid.Col>
      </Grid>
    </Fieldset>

    <Fieldset mt="lg" legend="Location">
      <Grid>
        <Grid.Col span={2}>
          <Autocomplete
            label="Region"
            placeholder="Pick one or enter new"
            data={knownRegions}
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

export default ProductForm;
