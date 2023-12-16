import { IconTrash } from "@tabler/icons-react";
import {
  ActionIcon,
  ActionIconVariant,
  Button,
  Center,
  Group,
  MantineSize,
  Modal,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CSSProperties } from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  confirm: () => void;
}
const ConfirmDeleteModal = ({
  open,
  onClose,
  itemName,
  confirm,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal title="Delete confirmation" opened={open} onClose={onClose} centered>
      <Text>Are you sure to delete :</Text>
      <Title order={3} my="md" c="red">
        {itemName}
      </Title>
      <Text>
        This action might be irreversible (depends on your data backup policy) ?
      </Text>
      <Center mt="lg">
        <Group gap="sm">
          <Button variant="default" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={confirm}>
            Confirm
          </Button>
        </Group>
      </Center>
    </Modal>
  );
};

interface AccordionDeleteItemButtonProps {
  itemName: string;
  size?: number | MantineSize | string | undefined;
  variant?: string | ActionIconVariant | undefined;
  iconStyle?: CSSProperties;
  onClick: () => void;
}
const DeleteItemButton = ({
  itemName,
  size,
  variant,
  iconStyle,
  onClick,
}: AccordionDeleteItemButtonProps) => {
  const [
    isConfirmModalOpen,
    { open: openConfirmModal, close: closeConfirmModal },
  ] = useDisclosure(false);

  return (
    <>
      <Tooltip label={"Delete"} openDelay={500}>
        <ActionIcon
          size={size}
          variant={variant}
          color="red"
          onClick={openConfirmModal}
        >
          <IconTrash style={iconStyle} />
        </ActionIcon>
      </Tooltip>
      <ConfirmDeleteModal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        itemName={itemName}
        confirm={() => {
          closeConfirmModal();
          onClick();
        }}
      />
    </>
  );
};

export default DeleteItemButton;
