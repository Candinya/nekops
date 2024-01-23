import type { NotificationData } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { rem } from "@mantine/core";

export const LoadingNotification: NotificationData = {
  color: "blue",
  loading: true,
  title: "Preparing shell...",
  message:
    "This shouldn't take too long... Or at least it's designed to be quick.",
  autoClose: false,
  withCloseButton: false,
};

export const SuccessNotification: NotificationData = {
  color: "teal",
  title: "Prepare finished!",
  message: "Enjoy your journey~",
  icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
  loading: false,
  autoClose: 4_000,
};

export const FailNotification: NotificationData = {
  color: "red",
  message:
    "It shouldn't take so long. If it's still not responding, you may need to restart the shell window, or even the whole program.",
};
