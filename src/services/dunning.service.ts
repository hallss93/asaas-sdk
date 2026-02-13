import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  ListPaymentDunningsParams,
  PaymentDunning,
  PaymentDunningHistoryEvent,
  PaymentDunningPartialPayment,
} from '../types/dunning.js';

/** Serviço de Recuperações/Negativações (paymentDunnings) da API Asaas */
export class DunningService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/paymentDunnings');
  }

  /** Listar negativações */
  list(params?: ListPaymentDunningsParams): Promise<PaginatedResponse<PaymentDunning>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PaymentDunning>>(this.path(), query);
  }

  /** Recuperar uma negativação pelo ID */
  getById(id: string): Promise<PaymentDunning> {
    return this.http.get<PaymentDunning>(this.path(id));
  }

  /** Cancelar negativação (verifique canBeCancelled no objeto antes) */
  cancel(id: string): Promise<PaymentDunning> {
    return this.http.post<PaymentDunning>(this.path(`${id}/cancel`));
  }

  /** Reenviar documentos da negativação (quando isNecessaryResendDocumentation) */
  resendDocuments(id: string, formData: FormData): Promise<PaymentDunning> {
    return this.http.postMultipart<PaymentDunning>(this.path(`${id}/documents`), formData);
  }

  /** Listar histórico de eventos da negativação */
  listHistory(
    id: string,
    params?: { offset?: number; limit?: number }
  ): Promise<PaginatedResponse<PaymentDunningHistoryEvent>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PaymentDunningHistoryEvent>>(
      this.path(`${id}/history`),
      query
    );
  }

  /** Listar pagamentos parciais recebidos (renegociação) da negativação */
  listPartialPayments(
    id: string,
    params?: { offset?: number; limit?: number }
  ): Promise<PaginatedResponse<PaymentDunningPartialPayment>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PaymentDunningPartialPayment>>(
      this.path(`${id}/partialPayments`),
      query
    );
  }
}
