import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Invoice,
  ListInvoicesParams,
  ListMunicipalServicesParams,
  MunicipalService,
  ScheduleInvoiceRequest,
  UpdateInvoiceRequest,
} from '../types/invoice.js';

/** Serviço de Notas fiscais (invoices) da API Asaas */
export class InvoiceService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/invoices');
  }

  /** Listar notas fiscais */
  list(params?: ListInvoicesParams): Promise<PaginatedResponse<Invoice>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<Invoice>>(this.path(), query);
  }

  /** Recuperar uma nota fiscal pelo ID */
  getById(id: string): Promise<Invoice> {
    return this.http.get<Invoice>(this.path(id));
  }

  /** Agendar emissão de nota fiscal (vinculada a cobrança ou assinatura) */
  schedule(data: ScheduleInvoiceRequest): Promise<Invoice> {
    return this.http.post<Invoice>(this.path(), data);
  }

  /** Atualizar nota fiscal agendada */
  update(id: string, data: UpdateInvoiceRequest): Promise<Invoice> {
    return this.http.put<Invoice>(this.path(id), data);
  }

  /** Autorizar/emitir nota fiscal */
  authorize(id: string): Promise<Invoice> {
    return this.http.post<Invoice>(this.path(`${id}/authorize`));
  }

  /** Cancelar uma nota fiscal */
  cancel(id: string): Promise<Invoice> {
    return this.http.post<Invoice>(this.path(`${id}/cancel`));
  }

  /** Listar serviços municipais (para emissão de NFS-e) */
  listMunicipalServices(
    params?: ListMunicipalServicesParams
  ): Promise<PaginatedResponse<MunicipalService>> {
    const query = params as Record<string, string | undefined>;
    return this.http.get<PaginatedResponse<MunicipalService>>(
      this.path('municipalServices'),
      query
    );
  }
}
