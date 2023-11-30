import { ActionIcon, Burger, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconSettings } from "@tabler/icons-react";
import type { MouseEventHandler } from "react";

interface HeaderProps {
  opened: boolean;
  toggle: MouseEventHandler<HTMLButtonElement>;
}
const Header = ({ opened, toggle }: HeaderProps) => (
  <Group h="100%" px="md">
    <Burger opened={opened} onClick={toggle} size="sm" />
    <Group justify="space-between" style={{ flex: 1 }}>
      <Link to={"/"}>
        <Group>
          <img alt="Nekops" src="/icon.png" width={40} height={40} />
          <Title order={1} size="h2">
            Nekops
          </Title>
        </Group>
      </Link>

      <Group ml="xl" gap={0}>
        <Link to={"/settings"}>
          <ActionIcon variant="filled" aria-label="Settings">
            <IconSettings
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Link>
      </Group>
    </Group>
  </Group>
);

export default Header;
