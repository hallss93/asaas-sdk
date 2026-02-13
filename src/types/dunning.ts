/**
 * Tipos para Recuperações/Negativações (paymentDunnings) - API Asaas v3.
 * @see https://docs.asaas.com/reference/list-payment-dunnings
 * @see https://docs.asaas.com/reference/cancelar-negativacao
 * @see https://docs.asaas.com/reference/reenviar-documentos
 */

/** Negativação (dunning) de cobrança */
export interface PaymentDunning {
  id?: string;
  payment?: string;
  status?: string;
  canBeCancelled?: boolean;
  isNecessaryResendDocumentation?: boolean;
  dateCreated?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar negativações */
export interface ListPaymentDunningsParams {
  offset?: number;
  limit?: number;
  payment?: string;
  status?: string;
  type?: string;
  requestStartDate?: string;
  requestEndDate?: string;
}

/** Payload para simular uma recuperação (POST /paymentDunnings/simulate) */
export interface SimulatePaymentDunningRequest {
  payment: string;
}

/** Resposta da simulação de recuperação */
export interface SimulatePaymentDunningResponse {
  payment?: string;
  types?: Array<{ type?: string; value?: number; [key: string]: unknown }>;
  [key: string]: unknown;
}

/** Cobrança disponível para recuperação (item da listagem paymentsAvailableForDunning) */
export interface PaymentAvailableForDunning {
  payment?: string;
  value?: number;
  [key: string]: unknown;
}

/** Parâmetros para listar cobranças disponíveis para recuperação */
export interface ListPaymentsAvailableForDunningParams {
  offset?: number;
  limit?: number;
}

/** Evento do histórico da negativação */
export interface PaymentDunningHistoryEvent {
  id?: string;
  date?: string;
  type?: string;
  description?: string;
  [key: string]: unknown;
}

/** Pagamento parcial (renegociação) */
export interface PaymentDunningPartialPayment {
  id?: string;
  value?: number;
  dateCreated?: string;
  [key: string]: unknown;
}
