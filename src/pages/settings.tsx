import { defaultSettings, type Settings } from "@/types/settings.ts";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  rem,
  SegmentedControl,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBolt, IconMoon, IconSun } from "@tabler/icons-react";

const colorSchemeData = [
  {
    icon: IconBolt,
    text: "Auto",
    value: "auto",
  },
  {
    icon: IconSun,
    text: "Light",
    value: "light",
  },
  {
    icon: IconMoon,
    text: "Dark",
    value: "dark",
  },
].map((item) => ({
  label: (
    <Center style={{ gap: 10 }}>
      <item.icon style={{ width: rem(16), height: rem(16) }} />
      <span>{item.text}</span>
    </Center>
  ),
  value: item.value,
}));

const SettingsPage = () => {
  const form = useForm<Settings>({
    initialValues: defaultSettings,

    validate: {},

    validateInputOnBlur: true,
  });

  const { setColorScheme } = useMantineColorScheme();

  const saveSettings = (settings: Settings) => {
    console.log(settings); // TODO: Save settings
    // Apply
    setColorScheme(settings.color_scheme);
    // Update settings
    form.setInitialValues(settings);
  };

  return (
    <Box p="md">
      <form onSubmit={form.onSubmit(saveSettings)}>
        <Flex direction="column" gap="md">
          <TextInput
            label="Data Directory"
            {...form.getInputProps("data_dir")}
          />

          <Flex direction="column">
            <Text size="sm" fw={500} mb={2}>
              Color Scheme
            </Text>
            <SegmentedControl
              data={colorSchemeData}
              {...form.getInputProps("color_scheme")}
            />
          </Flex>
        </Flex>

        <ButtonGroup mt="lg">
          <Button type="submit" disabled={!form.isDirty()}>
            Save
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default SettingsPage;
