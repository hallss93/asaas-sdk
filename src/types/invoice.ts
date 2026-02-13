/**
 * Tipos para Notas fiscais (invoices) - API Asaas v3.
 * @see https://docs.asaas.com/reference/listar-notas-fiscais
 * @see https://docs.asaas.com/reference/schedule-invoice
 * @see https://docs.asaas.com/reference/issue-an-invoice
 * @see https://docs.asaas.com/reference/atualizar-nota-fiscal
 */

/** Nota fiscal (invoice) */
export interface Invoice {
  id?: string;
  payment?: string;
  subscription?: string;
  status?: string;
  customer?: string;
  serviceDescription?: string;
  pdfUrl?: string;
  xmlUrl?: string;
  dateCreated?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar notas fiscais */
export interface ListInvoicesParams {
  offset?: number;
  limit?: number;
  payment?: string;
  subscription?: string;
  customer?: string;
  status?: string;
}

/** Payload para agendar/criar nota fiscal (POST /invoices) */
export interface ScheduleInvoiceRequest {
  payment?: string;
  subscription?: string;
  customer?: string;
  serviceDescription?: string;
  observations?: string;
  externalReference?: string;
  [key: string]: unknown;
}

/** Payload para atualizar nota fiscal (PUT /invoices/:id) */
export type UpdateInvoiceRequest = Partial<
  Omit<ScheduleInvoiceRequest, 'payment' | 'subscription' | 'customer'>
>;

/** Serviço municipal (item da listagem GET /invoices/municipalServices) */
export interface MunicipalService {
  id?: string;
  code?: string;
  description?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar serviços municipais (paginação: offset/limit) */
export interface ListMunicipalServicesParams {
  description?: string;
  offset?: number;
  limit?: number;
}
