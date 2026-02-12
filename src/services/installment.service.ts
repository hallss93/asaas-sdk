import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type { Installment, ListInstallmentsParams } from '../types/installment.js';

/** Serviço de Parcelamentos da API Asaas */
export class InstallmentService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/installments');
  }

  /** Recuperar um único parcelamento */
  async getById(id: string): Promise<Installment> {
    return this.http.get<Installment>(this.path(id));
  }

  /** Listar parcelamentos */
  async list(params?: ListInstallmentsParams): Promise<PaginatedResponse<Installment>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<Installment>>(this.path(), query);
  }

  /** Remover parcelamento */
  async delete(id: string): Promise<Installment> {
    return this.http.delete<Installment>(this.path(id));
  }

  /** Estornar parcelamento */
  async refund(id: string): Promise<Installment> {
    return this.http.post<Installment>(this.path(`${id}/refund`));
  }
}
