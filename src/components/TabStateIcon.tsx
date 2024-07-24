import type { ShellState } from "@/types/shellState.ts";
import { useMantineTheme } from "@mantine/core";
import { IconBellFilled, IconCircleFilled } from "@tabler/icons-react";

interface TabStateIconProps {
  state?: ShellState;
  isNewMessage?: boolean;
}
const TabStateIcon = ({ state, isNewMessage }: TabStateIconProps) => {
  const theme = useMantineTheme();
  const colorState =
    state === "loading"
      ? theme.colors.yellow[6]
      : state === "active"
        ? theme.colors.green[6]
        : state === "terminated"
          ? theme.colors.red[6]
          : theme.colors.gray[6];

  const Icon = isNewMessage ? IconBellFilled : IconCircleFilled;

  return (
    <Icon
      size={12}
      style={{
        color: colorState,
      }}
    />
  );
};

export default TabStateIcon;
