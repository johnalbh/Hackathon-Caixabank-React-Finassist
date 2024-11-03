import { atom } from 'nanostores';

export const notificationStore = atom({
  activeAlerts: [],
  notifications: [],
  unreadCount: 0,
});

export const showNotification = ({
  message,
  severity = 'success',
  duration = 6000,
}) => {
  const id = Date.now();
  const notification = {
    id,
    message,
    severity,
    timestamp: new Date(),
    read: false,
  };

  const store = notificationStore.get();
  const updatedNotifications = [notification, ...store.notifications].slice(
    0,
    50
  );
  const updatedActiveAlerts = [
    ...store.activeAlerts,
    {
      ...notification,
      duration,
    },
  ];

  notificationStore.set({
    activeAlerts: updatedActiveAlerts,
    notifications: updatedNotifications,
    unreadCount: store.unreadCount + 1,
  });

  setTimeout(() => {
    hideAlert(id);
  }, duration);
};

export const hideAlert = (id) => {
  const store = notificationStore.get();
  notificationStore.set({
    ...store,
    activeAlerts: store.activeAlerts.filter((n) => n.id !== id),
  });
};

export const markAsRead = (id) => {
  const store = notificationStore.get();
  const updatedNotifications = store.notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );

  const unreadCount = updatedNotifications.filter((n) => !n.read).length;

  notificationStore.set({
    ...store,
    notifications: updatedNotifications,
    unreadCount,
  });
};

export const markAllAsRead = () => {
  const store = notificationStore.get();
  const updatedNotifications = store.notifications.map((n) => ({
    ...n,
    read: true,
  }));

  notificationStore.set({
    ...store,
    notifications: updatedNotifications,
    unreadCount: 0,
  });
};
