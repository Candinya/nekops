import { type Settings } from "@/types/settings.ts";
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

import { saveSettings as saveSettingsToFileSystem } from "@/slices/settingsSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store.ts";

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
  // Redux related
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<Settings>({
    initialValues: {
      ...settings,
    },

    validate: {
      data_dir: (value) => !value, // Not empty
    },
  });

  const { setColorScheme } = useMantineColorScheme();

  const saveSettings = (newSettings: Settings) => {
    dispatch(
      saveSettingsToFileSystem({
        ...newSettings, // Prevent state binding caused lock
      }),
    );
    // Apply
    setColorScheme(newSettings.color_scheme);
    // Update settings
    form.setInitialValues(newSettings);
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
