import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

interface AccordionDeleteItemButtonProps {
  onClick: () => void;
}
const AccordionDeleteItemButton = ({
  onClick, // TODO: check before delete (long press or dialog confirmation)
}: AccordionDeleteItemButtonProps) => (
  <ActionIcon size="lg" variant={"subtle"} color="red" onClick={onClick}>
    <IconTrash />
  </ActionIcon>
);

export default AccordionDeleteItemButton;
