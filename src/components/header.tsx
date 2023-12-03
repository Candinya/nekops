import { ActionIcon, Burger, Group, Title } from "@mantine/core";
import type { MouseEventHandler } from "react";
import { IconBell } from "@tabler/icons-react";

interface HeaderProps {
  isNavOpen: boolean;
  toggleNavOpen: MouseEventHandler<HTMLButtonElement>;
  isNotificationCenterOpen: boolean;
  toggleNotificationCenterOpen: MouseEventHandler<HTMLButtonElement>;
}
const Header = ({
  isNavOpen,
  toggleNavOpen,
  isNotificationCenterOpen,
  toggleNotificationCenterOpen,
}: HeaderProps) => (
  <Group h="100%" px="md">
    <Burger opened={isNavOpen} onClick={toggleNavOpen} size="sm" />
    <Group justify="space-between" style={{ flex: 1 }}>
      <Group>
        <img alt="Nekops" src="/icon.png" width={40} height={40} />
        <Title order={1} size="h2">
          Nekops
        </Title>
      </Group>

      <Group ml="xl" gap={0}>
        <ActionIcon
          variant={isNotificationCenterOpen ? "filled" : "default"}
          onClick={toggleNotificationCenterOpen}
          aria-label="Settings"
        >
          <IconBell style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Group>
  </Group>
);

export default Header;
