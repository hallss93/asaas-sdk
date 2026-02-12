import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreatePaymentLinkRequest,
  ListPaymentLinksParams,
  PaymentLink,
  UpdatePaymentLinkRequest,
} from '../types/payment-link.js';

/** Serviço de Links de Pagamento da API Asaas */
export class PaymentLinkService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/paymentLinks');
  }

  /** Criar um link de pagamentos */
  async create(data: CreatePaymentLinkRequest): Promise<PaymentLink> {
    return this.http.post<PaymentLink>(this.path(), data);
  }

  /** Recuperar um único link de pagamentos */
  async getById(id: string): Promise<PaymentLink> {
    return this.http.get<PaymentLink>(this.path(id));
  }

  /** Listar links de pagamento */
  async list(params?: ListPaymentLinksParams): Promise<PaginatedResponse<PaymentLink>> {
    const query = params as Record<string, string | number | boolean | undefined>;
    return this.http.get<PaginatedResponse<PaymentLink>>(this.path(), query);
  }

  /** Atualizar um link de pagamentos */
  async update(id: string, data: UpdatePaymentLinkRequest): Promise<PaymentLink> {
    return this.http.put<PaymentLink>(this.path(id), data);
  }

  /** Remover um link de pagamentos */
  async delete(id: string): Promise<PaymentLink> {
    return this.http.delete<PaymentLink>(this.path(id));
  }

  /** Restaurar um link de pagamentos */
  async restore(id: string): Promise<PaymentLink> {
    return this.http.post<PaymentLink>(this.path(`${id}/restore`));
  }
}
