import { Drawer, Notification, rem } from "@mantine/core";
import { IconInfoSmall } from "@tabler/icons-react";

interface NotificationsProps {
  isNotificationCenterOpen: boolean;
  closeNotificationCenter: () => void;
}
const NotificationCenter = ({
  isNotificationCenterOpen,
  closeNotificationCenter,
}: NotificationsProps) => (
  <Drawer
    opened={isNotificationCenterOpen}
    onClose={closeNotificationCenter}
    title="Notifications"
    position="right"
  >
    <Notification
      withBorder
      icon={<IconInfoSmall style={{ width: rem(40), height: rem(40) }} />}
      title="A notification element"
    >
      This is notification center, welcome! This is a notification element.
    </Notification>
  </Drawer>
);

export default NotificationCenter;
