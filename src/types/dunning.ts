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
