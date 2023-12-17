import { type Settings } from "@/types/settings.ts";
import { useForm } from "@mantine/form";
import {
  ActionIcon,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Group,
  PasswordInput,
  rem,
  SegmentedControl,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBolt,
  IconLock,
  IconLockOpen,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

import { saveSettings as saveSettingsToFileSystem } from "@/slices/settingsSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  decryptServer,
  encryptServer,
  updatePassword,
} from "@/slices/encryptionSlice.ts";
import { useDisclosure } from "@mantine/hooks";
import UnlockModal from "@/components/UnlockModal.tsx";
import { notifications } from "@mantine/notifications";
import { actionIconStyle } from "@/common/actionStyles.ts";
import { saveServers, updateServerByIndex } from "@/slices/serversSlice.ts";
import { deepClone } from "@/utils/deepClone.ts";

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

interface SettingsExtended extends Settings {
  password?: string;
}

const passwordUnchanged = "keep-unchanged";

const SettingsPage = () => {
  // Redux related
  const settings = useSelector((state: RootState) => state.settings);
  const encryption = useSelector((state: RootState) => state.encryption);
  const servers = useSelector((state: RootState) => state.servers);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<SettingsExtended>({
    initialValues: {
      ...settings,
      password: encryption.isEncryptionEnabled ? passwordUnchanged : "",
    },

    validate: {
      data_dir: (value) => !value, // Not empty
    },
  });

  const { setColorScheme } = useMantineColorScheme();

  const saveSettings = async (newSettings: SettingsExtended) => {
    // Apply
    setColorScheme(newSettings.color_scheme);
    if (newSettings.password !== passwordUnchanged) {
      // Set new password
      const newEncryptionState = await dispatch(
        updatePassword(newSettings.password ?? ""),
      ).unwrap();
      servers.map((server, index) => {
        dispatch(
          updateServerByIndex({
            index,
            server: encryptServer(
              newEncryptionState,
              decryptServer(encryption, server),
            ),
          }),
        );
      });
      dispatch(saveServers());
    }
    // Update settings
    form.setInitialValues({
      ...newSettings,
      password: Boolean(newSettings.password) ? passwordUnchanged : "",
    });
    const newSettingsCopy = deepClone(newSettings);
    delete newSettingsCopy.password;
    dispatch(saveSettingsToFileSystem(newSettingsCopy));
    form.reset();
  };

  const [
    isUnlockModalOpen,
    { open: openUnlockModal, close: closeUnlockModal },
  ] = useDisclosure(false);

  return (
    <>
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

            <Group>
              <PasswordInput
                label="Password"
                disabled={!encryption.isUnlocked}
                style={{
                  flexGrow: 1,
                }}
                {...form.getInputProps("password")}
              />

              <Tooltip label="Unlock" openDelay={500}>
                <ActionIcon
                  size="lg"
                  color={encryption.isUnlocked ? "green" : "orange"}
                  onClick={() => {
                    if (encryption.isUnlocked) {
                      notifications.show({
                        color: "green",
                        title: "You've already unlocked!",
                        message: "Feel free to change password",
                      });
                    } else {
                      openUnlockModal();
                    }
                  }}
                  style={{
                    alignSelf: "end",
                  }}
                >
                  {encryption.isUnlocked ? (
                    <IconLockOpen style={actionIconStyle} />
                  ) : (
                    <IconLock style={actionIconStyle} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Flex>

          <ButtonGroup mt="lg">
            <Button type="submit" disabled={!form.isDirty()}>
              Save
            </Button>
          </ButtonGroup>
        </form>
      </Box>

      <UnlockModal
        isOpen={isUnlockModalOpen}
        close={closeUnlockModal}
        successMessage="Feel free to change password"
      />
    </>
  );
};

export default SettingsPage;