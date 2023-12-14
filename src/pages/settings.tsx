import type { Settings } from "@/types/settings.ts";
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

const Settings = () => {
  const form = useForm<Settings>({
    initialValues: {
      data_dir: "~/.nekops/",
      color_scheme: "auto",
    },

    validate: {},

    validateInputOnBlur: true,
  });

  const { setColorScheme } = useMantineColorScheme();

  const saveSettings = (settings: Settings) => {
    console.log(settings);
    setColorScheme(settings.color_scheme);
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
              data={[
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconBolt style={{ width: rem(16), height: rem(16) }} />
                      <span>Auto</span>
                    </Center>
                  ),
                  value: "auto",
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconSun style={{ width: rem(16), height: rem(16) }} />
                      <span>Light</span>
                    </Center>
                  ),
                  value: "light",
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconMoon style={{ width: rem(16), height: rem(16) }} />
                      <span>Dark</span>
                    </Center>
                  ),
                  value: "dark",
                },
              ]}
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

export default Settings;
