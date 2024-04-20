import { Divider } from "@mantine/core";

interface GroupDividerProps {
  label: string;
}
const GroupDivider = ({ label }: GroupDividerProps) => (
  <Divider
    mt="md"
    pb="md"
    variant="dashed"
    opacity={30}
    label={label}
    pos="sticky"
    top={0}
    style={{
      zIndex: 1,
      backgroundColor: "var(--mantine-color-body)",
    }}
  />
);

export default GroupDivider;
