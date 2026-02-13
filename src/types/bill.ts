/**
 * Tipos para Pagamento de contas (bill) - API Asaas v3.
 * @see https://docs.asaas.com/reference/criar-um-pagamento-de-conta
 * @see https://docs.asaas.com/reference/list-bill-payments
 * @see https://docs.asaas.com/reference/simular-um-pagamento-de-conta
 * @see https://docs.asaas.com/reference/cancelar-pagamento-de-contas
 */

/** Pagamento de conta (bill) */
export interface Bill {
  id?: string;
  status?: string;
  identificationField?: string;
  dueDate?: string;
  scheduleDate?: string;
  value?: number;
  canBeCancelled?: boolean;
  dateCreated?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar pagamentos de conta */
export interface ListBillsParams {
  offset?: number;
  limit?: number;
  status?: string;
}

/** Payload para criar pagamento de conta (linha digitável do boleto) */
export interface CreateBillRequest {
  /** Linha digitável do boleto a ser pago */
  identificationField: string;
  /** Data para agendar o pagamento (YYYY-MM-DD). Se não informado, paga na data de vencimento */
  scheduleDate?: string;
  [key: string]: unknown;
}

/** Resposta da simulação de pagamento de conta */
export interface SimulateBillResponse {
  value?: number;
  dueDate?: string;
  [key: string]: unknown;
}
