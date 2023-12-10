import type { InputFormProps } from "../inputFormProps.ts";
import {
  Checkbox,
  Fieldset,
  Flex,
  Group,
  NumberInput,
  PasswordInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@mantine/core";

const AccessForm = ({ form }: InputFormProps) => (
  <>
    <Fieldset legend="Regular Access (SSH)">
      <Group>
        <NumberInput
          label="Port"
          allowNegative={false}
          allowDecimal={false}
          allowLeadingZeros={false}
          min={1}
          max={65535}
          {...form.getInputProps("access.regular.port")}
        />
        <TextInput
          label="User"
          style={{
            flexGrow: 1,
          }}
          {...form.getInputProps("access.regular.user")}
        />
        <Flex direction="column" justify="end">
          <Text size="sm" fw={500} mb={1}>
            Private
          </Text>
          <Checkbox
            size="xl"
            {...form.getInputProps("access.regular.private")}
          />
        </Flex>
      </Group>
    </Fieldset>
    <Fieldset mt="md" legend="Emergency Access">
      <PasswordInput
        label="Root Password"
        {...form.getInputProps("access.emergency.root_password")}
      />
      <Group mt="md">
        <Flex direction="column">
          <Text size="sm" fw={500} mb={2}>
            Family
          </Text>
          <SegmentedControl
            data={["VNC", "IPMI", "Other"]}
            {...form.getInputProps("access.emergency.method")}
          />
        </Flex>
        <TextInput
          label="Address"
          style={{
            flexGrow: 1,
          }}
          {...form.getInputProps("access.emergency.address")}
        />
      </Group>
      <Group mt="md" grow>
        <TextInput
          label="Username"
          disabled={form.values.access.emergency.method === "VNC"}
          {...form.getInputProps("access.emergency.username")}
        />
        <PasswordInput
          label="Password"
          {...form.getInputProps("access.emergency.password")}
        />
      </Group>
    </Fieldset>
  </>
);

export default AccessForm;
