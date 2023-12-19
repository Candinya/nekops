import type { InputFormProps } from "../inputFormProps.ts";
import {
  Autocomplete,
  Fieldset,
  Flex,
  Group,
  NumberInput,
  PasswordInput,
  SegmentedControl,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";

const AccessForm = ({ form }: InputFormProps) => {
  const publicAccessEndpoints = [
    ...new Set(form.values.network.public.map((ip) => ip.alias || ip.address)),
  ];

  const privateAccessEndpoints = [
    ...new Set(form.values.network.private.map((ip) => ip.alias || ip.address)),
  ].filter((endpoint) => !publicAccessEndpoints.includes(endpoint));

  return (
    <>
      <Fieldset legend="Regular Access (SSH)">
        <Autocomplete
          label="Address"
          placeholder="Pick one or enter new"
          data={[
            {
              group: "Public",
              items: publicAccessEndpoints,
            },
            {
              group: "Private",
              items: privateAccessEndpoints,
            },
          ]}
          style={{
            flexGrow: 1,
          }}
          {...form.getInputProps("access.regular.address")}
        />
        <Group mt="md">
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
              Type
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
            {...form.getInputProps("access.emergency.username")}
          />
          <PasswordInput
            label="Password"
            {...form.getInputProps("access.emergency.password")}
          />
        </Group>
        <Textarea
          mt="md"
          label="Comment"
          autosize
          minRows={4}
          placeholder="Don't forget to backup before reboot!"
          {...form.getInputProps("access.emergency.comment")}
        />
      </Fieldset>
    </>
  );
};

export default AccessForm;
