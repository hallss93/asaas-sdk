import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  ListDunningHistoryParams,
  ListDunningPartialPaymentsParams,
  ListPaymentDunningsParams,
  ListPaymentsAvailableForDunningParams,
  PaymentAvailableForDunning,
  PaymentDunning,
  PaymentDunningHistoryEvent,
  PaymentDunningPartialPayment,
  SimulatePaymentDunningRequest,
  SimulatePaymentDunningResponse,
} from '../types/dunning.js';

/** Serviço de Recuperações/Negativações (paymentDunnings) da API Asaas */
export class DunningService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/paymentDunnings');
  }

  /** Criar uma recuperação (multipart: payment, description, customerName, customerCpfCnpj, type, documents, etc.) */
  create(formData: FormData): Promise<PaymentDunning> {
    return this.http.postMultipart<PaymentDunning>(this.path(), formData);
  }

  /** Simular uma recuperação antes de criar */
  simulate(request: SimulatePaymentDunningRequest): Promise<SimulatePaymentDunningResponse> {
    return this.http.post<SimulatePaymentDunningResponse>(this.path('simulate'), request);
  }

  /** Listar cobranças disponíveis para recuperação (negativação) */
  listPaymentsAvailable(
    params?: ListPaymentsAvailableForDunningParams
  ): Promise<PaginatedResponse<PaymentAvailableForDunning>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PaymentAvailableForDunning>>(
      this.path('paymentsAvailableForDunning'),
      query
    );
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
    params?: ListDunningHistoryParams
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
    params?: ListDunningPartialPaymentsParams
  ): Promise<PaginatedResponse<PaymentDunningPartialPayment>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PaymentDunningPartialPayment>>(
      this.path(`${id}/partialPayments`),
      query
    );
  }
}
