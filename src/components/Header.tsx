import { ActionIcon, Burger, Group, Menu, Title } from "@mantine/core";
import type { MouseEventHandler } from "react";
import {
  IconCheck,
  IconHeart,
  IconStack,
  IconStack2,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store.ts";
import { actionIconStyle } from "@/common/actionStyles.ts";
import {
  saveSettings,
  setCurrentWorkspaceByID,
} from "@/slices/settingsSlice.ts";
import { readServers } from "@/slices/serversSlice.ts";
import { readSnippets } from "@/slices/snippetsSlice.ts";
import { readEncryption } from "@/slices/encryptionSlice.ts";

const WorkspaceSelector = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();

  const switchWorkspace = (id: string) => {
    dispatch(setCurrentWorkspaceByID(id));
    dispatch(saveSettings());

    // Initialize workspace
    dispatch(readServers());
    dispatch(readSnippets());
    dispatch(readEncryption());
  };

  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <ActionIcon>
          <IconStack2 style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Workspaces</Menu.Label>
        {settings.workspaces.map((w) => (
          <Menu.Item
            key={w.id}
            leftSection={
              w.id === settings.currentWorkspace.id ? (
                <IconCheck style={actionIconStyle} />
              ) : (
                <IconStack style={actionIconStyle} />
              )
            }
            disabled={w.id === settings.currentWorkspace.id}
            onClick={() => switchWorkspace(w.id)}
          >
            {w.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

interface HeaderProps {
  isNavOpen: boolean;
  toggleNav: MouseEventHandler<HTMLButtonElement>;
  openAboutModal: () => void;
}
const Header = ({ isNavOpen, toggleNav, openAboutModal }: HeaderProps) => (
  <Group h="100%" px="md">
    <Burger opened={isNavOpen} onClick={toggleNav} size="sm" />
    <Group justify="space-between" style={{ flex: 1 }}>
      <Group>
        <img alt="Nekops" src="/icon.png" width={40} height={40} />
        <Title order={1} size="h2">
          Nekops
        </Title>
      </Group>

      <Group ml="xl">
        <WorkspaceSelector />
        <ActionIcon color="pink" variant="light" onClick={openAboutModal}>
          <IconHeart style={actionIconStyle} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Group>
  </Group>
);

export default Header;
