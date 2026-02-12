import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreatePaymentRequest,
  ListPaymentsParams,
  Payment,
  UpdatePaymentRequest,
} from '../types/payment.js';

/** Serviço de Cobranças da API Asaas */
export class PaymentService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/payments');
  }

  /** Criar nova cobrança */
  async create(data: CreatePaymentRequest): Promise<Payment> {
    return this.http.post<Payment>(this.path(), data);
  }

  /** Recuperar uma única cobrança */
  async getById(id: string): Promise<Payment> {
    return this.http.get<Payment>(this.path(id));
  }

  /** Listar cobranças */
  async list(params?: ListPaymentsParams): Promise<PaginatedResponse<Payment>> {
    const query = params as Record<string, string | number | boolean | undefined>;
    return this.http.get<PaginatedResponse<Payment>>(this.path(), query);
  }

  /** Atualizar cobrança existente (API usa POST) */
  async update(id: string, data: UpdatePaymentRequest): Promise<Payment> {
    return this.http.post<Payment>(this.path(id), data);
  }

  /** Remover cobrança */
  async delete(id: string): Promise<Payment> {
    return this.http.delete<Payment>(this.path(id));
  }

  /** Restaurar cobrança removida */
  async restore(id: string): Promise<Payment> {
    return this.http.post<Payment>(this.path(`${id}/restore`));
  }

  /** Estornar cobrança */
  async refund(id: string): Promise<Payment> {
    return this.http.post<Payment>(this.path(`${id}/refund`));
  }

  /** Obter linha digitável do boleto */
  async getDigitableLine(id: string): Promise<{ identificationField: string }> {
    return this.http.get<{ identificationField: string }>(this.path(`${id}/identificationField`));
  }

  /** Obter QR Code PIX */
  async getPixQrCode(id: string): Promise<{
    encodedImage: string;
    payload: string;
    expirationDate?: string;
  }> {
    return this.http.get(this.path(`${id}/pixQrCode`));
  }

  /** Confirmar recebimento em dinheiro */
  async receiveInCash(
    id: string,
    paymentDate: string,
    value: number,
    notifyCustomer?: boolean
  ): Promise<Payment> {
    return this.http.post<Payment>(this.path(`${id}/receiveInCash`), {
      paymentDate,
      value,
      notifyCustomer,
    });
  }

  /** Desfazer confirmação de recebimento em dinheiro */
  async undoReceivedInCash(id: string): Promise<Payment> {
    return this.http.post<Payment>(this.path(`${id}/undoReceivedInCash`));
  }
}
