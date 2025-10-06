type NotificationType = 'info' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

type NotificationListener = (notifications: Notification[]) => void;

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Set<NotificationListener> = new Set();

  subscribe(listener: NotificationListener) {
    this.listeners.add(listener);
    listener(this.notifications);
    return () => {
      this.listeners.delete(listener);
    };
  }

  show(type: NotificationType, message: string) {
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const notification: Notification = { id, type, message };

    this.notifications = [...this.notifications, notification];
    this.notifyListeners();

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);

    return id;
  }

  remove(id: string) {
    const newNotifications = this.notifications.filter(n => n.id !== id);
    if (newNotifications.length !== this.notifications.length) {
      this.notifications = newNotifications;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}

export const notificationManager = new NotificationManager();

