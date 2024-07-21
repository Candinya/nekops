import type { SettingsState, WorkSpace } from "@/types/settings.ts";
import { defaultWorkspace } from "@/types/settings.ts";
import { useForm, type UseFormReturnType } from "@mantine/form";
import type { MantineColorScheme } from "@mantine/core";
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  ButtonGroup,
  Center,
  Fieldset,
  Flex,
  Grid,
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
  IconCode,
  IconFolder,
  IconLock,
  IconLockOpen,
  IconMoon,
  IconPlus,
  IconRocket,
  IconSun,
} from "@tabler/icons-react";
import { saveSettings } from "@/slices/settingsSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store.ts";
import {
  decryptServer,
  encryptServer,
  readEncryption,
  updatePassword,
} from "@/slices/encryptionSlice.ts";
import { useDisclosure } from "@mantine/hooks";
import UnlockModal from "@/components/UnlockModal.tsx";
import { notifications } from "@mantine/notifications";
import { actionIconStyle } from "@/common/actionStyles.ts";
import {
  readServers,
  saveServers,
  updateServerByIndex,
} from "@/slices/serversSlice.ts";
import { open } from "@tauri-apps/plugin-dialog";
import DeleteItemButton from "@/components/DeleteItemButton.tsx";
import { readSnippets } from "@/slices/snippetsSlice.ts";
import type { ReactNode } from "react";

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
];

const transformSegmentedControlOptions = (
  data: {
    icon: (props: any) => ReactNode;
    text: string;
    value: string;
  }[],
) =>
  data.map((item) => ({
    label: (
      <Center style={{ gap: 10 }}>
        <item.icon style={{ width: rem(16), height: rem(16) }} />
        <span>{item.text}</span>
      </Center>
    ),
    value: item.value,
  }));

interface SettingsExtended extends SettingsState {
  password?: string;
}

const passwordUnchanged = "keep-unchanged";

interface SettingsFormProps {
  form: UseFormReturnType<
    SettingsExtended,
    (values: SettingsExtended) => SettingsExtended
  >;
}

interface WorkspaceItemProps extends SettingsFormProps {
  w: WorkSpace;
  index: number;
  selectDataDirectory: () => void;
}
const WorkspaceItem = ({
  w,
  index,
  selectDataDirectory,
  form,
}: WorkspaceItemProps) => (
  <Accordion.Item value={`workspace_${index}`}>
    <Center>
      <Accordion.Control>{w.name}</Accordion.Control>
      <DeleteItemButton
        size={"lg"}
        variant={"subtle"}
        itemName={w.name}
        onClick={() => form.removeListItem("workspaces", index)}
      />
    </Center>
    <Accordion.Panel>
      <Grid>
        <Grid.Col span={4}>
          <TextInput
            label="ID"
            {...form.getInputProps(`workspaces.${index}.id`)}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <TextInput
            label="Name"
            {...form.getInputProps(`workspaces.${index}.name`)}
          />
        </Grid.Col>
      </Grid>

      <Group>
        <TextInput
          label="Data Directory"
          style={{
            flexGrow: 1,
          }}
          {...form.getInputProps(`workspaces.${index}.data_dir`)}
        />

        <Tooltip label="Select" openDelay={500}>
          <ActionIcon
            size="lg"
            onClick={selectDataDirectory}
            style={{
              alignSelf: "end",
            }}
          >
            <IconFolder style={actionIconStyle} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Accordion.Panel>
  </Accordion.Item>
);

interface WorkspaceGroupProps extends SettingsFormProps {}
const WorkspaceGroup = ({ form }: WorkspaceGroupProps) => {
  const selectDataDirectory = async (index: number) => {
    const dataDir = await open({
      multiple: false,
      directory: true,
    });
    if (dataDir) {
      form.setFieldValue(`workspaces.${index}.data_dir`, dataDir);
    }
  };

  return (
    <Fieldset legend="Workspaces">
      <Accordion>
        {form.values.workspaces.map((w: WorkSpace, index: number) => (
          <WorkspaceItem
            key={index}
            index={index}
            w={w}
            selectDataDirectory={() => {
              selectDataDirectory(index);
            }}
            form={form}
          />
        ))}
      </Accordion>
      <Center mt="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() =>
            form.insertListItem("workspaces", structuredClone(defaultWorkspace))
          }
        >
          Add
        </Button>
      </Center>
    </Fieldset>
  );
};

const ColorSchemeSelector = () => {
  const { colorScheme, setColorScheme, clearColorScheme } =
    useMantineColorScheme();

  return (
    <Flex direction="column">
      <Text size="sm" fw={500} mb={2}>
        Color Scheme
      </Text>
      <SegmentedControl
        data={transformSegmentedControlOptions(colorSchemeData)}
        value={colorScheme}
        onChange={(newScheme) => {
          if (["light", "dark", "auto"].includes(newScheme)) {
            setColorScheme(newScheme as MantineColorScheme);
          } else {
            // Unknown value
            clearColorScheme();
          }
        }}
      />
    </Flex>
  );
};

const SettingsPage = () => {
  // Redux related
  const settings = useSelector((state: RootState) => state.settings);
  const encryption = useSelector((state: RootState) => state.encryption);
  const servers = useSelector((state: RootState) => state.servers);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<SettingsExtended>({
    initialValues: {
      ...structuredClone(settings),
      password: encryption.isEncryptionEnabled ? passwordUnchanged : "",
    },
  });

  const save = async (newSettings: SettingsExtended) => {
    if (
      (encryption.isEncryptionEnabled || newSettings.password !== "") &&
      newSettings.password !== passwordUnchanged
    ) {
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
      dispatch(saveServers(servers.map((server) => server.id)));
    }
    // Select workspace
    if (newSettings.workspaces.length === 0) {
      newSettings.workspaces.push(defaultWorkspace);
    }
    const currentWorkspaceIndex = settings.workspaces.findIndex(
      (w) => w.id === settings.current_workspace.id,
    );
    const targetWorkspace =
      newSettings.workspaces[
        newSettings.workspaces.length > currentWorkspaceIndex
          ? currentWorkspaceIndex
          : 0 // No match, use first
      ];
    // Update settings
    const newSettingsState: SettingsState = {
      workspaces: newSettings.workspaces,
      current_workspace: targetWorkspace,
      default_ssh_action: newSettings.default_ssh_action,
    };
    await dispatch(saveSettings(newSettingsState)).unwrap();
    if (form.isDirty("workspaces")) {
      // Initialize workspace
      dispatch(readServers());
      dispatch(readSnippets());
      dispatch(readEncryption());
    }
    form.setInitialValues({
      ...newSettings,
      password: Boolean(newSettings.password) ? passwordUnchanged : "",
    });
    form.reset();
  };

  const [
    isUnlockModalOpen,
    { open: openUnlockModal, close: closeUnlockModal },
  ] = useDisclosure(false);

  return (
    <>
      <Box p="md">
        <form onSubmit={form.onSubmit(save)}>
          <Flex direction="column" gap="md">
            <Fieldset legend="Global">
              <ColorSchemeSelector />
              <Flex direction="column" mt="md">
                <Text size="sm" fw={500} mb={2}>
                  Default SSH Action
                </Text>
                <SegmentedControl
                  data={transformSegmentedControlOptions([
                    {
                      icon: IconCode,
                      text: "Copy Command",
                      value: "copy",
                    },
                    {
                      icon: IconRocket,
                      text: "Start Session",
                      value: "start",
                    },
                  ])}
                  {...form.getInputProps("default_ssh_action")}
                />
              </Flex>
            </Fieldset>

            <WorkspaceGroup form={form} />

            <Fieldset legend="Current Workspace">
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
            </Fieldset>
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
