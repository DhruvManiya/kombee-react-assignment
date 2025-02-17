import { NotificationData, notifications } from '@mantine/notifications';
import { X, Check } from 'react-feather';

type ItNotifications = {
  show: (notification: NotificationData) => void;
  success: (notification: NotificationData) => void;
  error: (notification: NotificationData) => void;
};

export const tNotifications: ItNotifications = {
  show: (props: NotificationData) => {
    const { title, message, ...others } = props;
    notifications.show({
      title,
      message,
      position: 'bottom-right',
      withCloseButton: true,
      autoClose: 5000,
      ...others,
    });
  },

  success: (props: NotificationData) => {
    tNotifications.show({
      color: 'green',
      icon: <Check height={24} width={24} />,
      ...props,
    });
  },

  error: (props: NotificationData) => {
    tNotifications.show({
      color: 'red',
      icon: <X height={24} width={24} />,
      ...props,
    });
  },
};