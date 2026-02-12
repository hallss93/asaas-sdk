import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type { Payment } from '../types/payment.js';
import type {
  CreateSubscriptionRequest,
  ListSubscriptionsParams,
  Subscription,
  UpdateSubscriptionRequest,
} from '../types/subscription.js';

/** Serviço de Assinaturas da API Asaas */
export class SubscriptionService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/subscriptions');
  }

  /** Criar nova assinatura */
  async create(data: CreateSubscriptionRequest): Promise<Subscription> {
    return this.http.post<Subscription>(this.path(), data);
  }

  /** Recuperar uma única assinatura */
  async getById(id: string): Promise<Subscription> {
    return this.http.get<Subscription>(this.path(id));
  }

  /** Listar assinaturas */
  async list(params?: ListSubscriptionsParams): Promise<PaginatedResponse<Subscription>> {
    const query = params as Record<string, string | number | boolean | undefined>;
    return this.http.get<PaginatedResponse<Subscription>>(this.path(), query);
  }

  /** Listar cobranças de uma assinatura */
  async listPayments(id: string): Promise<PaginatedResponse<Payment>> {
    return this.http.get<PaginatedResponse<Payment>>(this.path(`${id}/payments`));
  }

  /** Atualizar assinatura existente (API usa POST) */
  async update(id: string, data: UpdateSubscriptionRequest): Promise<Subscription> {
    return this.http.post<Subscription>(this.path(id), data);
  }

  /** Remover assinatura */
  async delete(id: string): Promise<Subscription> {
    return this.http.delete<Subscription>(this.path(id));
  }
}
