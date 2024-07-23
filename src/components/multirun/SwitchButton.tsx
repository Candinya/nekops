import { ActionIcon, Box, MantineColor, Text, Tooltip } from "@mantine/core";
import { actionIconStyle } from "@/common/actionStyles.ts";
import type { ReactNode } from "react";

interface SwitchButtonProps {
  isEnabled: boolean;
  setIsEnabled: (isEnabled: boolean) => void;
  description: ReactNode;
  color: MantineColor;
  icon: (props: any) => ReactNode;
}
const SwitchButton = ({
  isEnabled,
  setIsEnabled,
  description,
  color,
  icon: Icon,
}: SwitchButtonProps) => (
  <Tooltip
    label={
      <Box
        style={{
          textAlign: "center",
        }}
      >
        <Text size="sm">{description}</Text>
        <Text fw={700} fs="italic">
          ({isEnabled ? "Enabled" : "Disabled"})
        </Text>
      </Box>
    }
  >
    <ActionIcon
      color={color}
      variant={isEnabled ? "filled" : "light"}
      onClick={() => setIsEnabled(!isEnabled)}
    >
      <Icon style={actionIconStyle} />
    </ActionIcon>
  </Tooltip>
);

export default SwitchButton;
