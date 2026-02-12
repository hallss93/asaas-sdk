/** Payload para atualizar notificação */
export interface UpdateNotificationRequest {
  enabled?: boolean;
  emailEnabledForProvider?: boolean;
  smsEnabledForProvider?: boolean;
  emailEnabledForCustomer?: boolean;
  smsEnabledForCustomer?: boolean;
  phoneCallEnabledForCustomer?: boolean;
  scheduleOffset?: number;
}

/** Notificação retornada pela API */
export interface Notification {
  id?: string;
  enabled?: boolean;
  emailEnabledForProvider?: boolean;
  smsEnabledForProvider?: boolean;
  emailEnabledForCustomer?: boolean;
  smsEnabledForCustomer?: boolean;
  phoneCallEnabledForCustomer?: boolean;
  scheduleOffset?: number;
  [key: string]: unknown;
}
