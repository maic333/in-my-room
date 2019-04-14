export interface NotificationAction {
  label: string;
  func: (close: () => any) => any;
}

export const enum NotificationDuration {
  QUICK = 4500
}

export const enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

export interface NotificationConfig {
  message: string;
  type?: NotificationType;
  actions?: NotificationAction[];
  dismissable?: boolean;
}
