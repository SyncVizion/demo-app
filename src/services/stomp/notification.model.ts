export interface Notification {
  type: NotificationType;
  read: boolean;
  receiverId: number;
  data: any;
}

export enum NotificationType {
  USER = 'USER',
  REPORT = 'REPORT',
}
