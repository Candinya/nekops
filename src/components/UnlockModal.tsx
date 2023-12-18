import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store.ts";
import { useForm } from "@mantine/form";
import { unlock } from "@/slices/encryptionSlice.ts";
import { notifications } from "@mantine/notifications";
import { Button, Center, Modal, PasswordInput } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";

interface UnlockModalProps {
  isOpen: boolean;
  close: () => void;
  successMessage: string;
}
const UnlockModal = ({ isOpen, close, successMessage }: UnlockModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  interface UnlockForm {
    password: string;
  }

  const form = useForm<UnlockForm>({
    initialValues: {
      password: "",
    },
  });

  const unlockFromSubmit = async (values: UnlockForm) => {
    try {
      await dispatch(unlock(values.password)).unwrap();
      notifications.show({
        color: "green",
        title: "Unlocked successfully!",
        message: successMessage,
      });
      close();
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Unlock failed",
        message:
          "Maybe the password is not correct? No hurry, let's try again.",
      });
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      title="Unlock"
      size="lg"
      radius="md"
      centered
    >
      <form onSubmit={form.onSubmit(unlockFromSubmit)}>
        <PasswordInput
          label="Password"
          data-autofocus
          {...form.getInputProps("password")}
        />

        <Center mt="lg">
          <Button type="submit" leftSection={<IconLock />}>
            Unlock
          </Button>
        </Center>
      </form>
    </Modal>
  );
};

export default UnlockModal;
