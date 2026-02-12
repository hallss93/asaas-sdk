import { BaseService } from './BaseService.js';
import type { Notification, UpdateNotificationRequest } from '../types/notification.js';

/** Serviço de Notificações da API Asaas */
export class NotificationService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/notifications');
  }

  /** Atualizar notificação existente (API usa POST) */
  async update(id: string, data: UpdateNotificationRequest): Promise<Notification> {
    return this.http.post<Notification>(this.path(id), data);
  }
}
