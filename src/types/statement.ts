/**
 * Tipos para Extrato (financialTransactions) - API Asaas v3.
 * @see https://docs.asaas.com/reference/recuperar-extrato
 */

/** Transação financeira do extrato */
export interface FinancialTransaction {
  id?: string;
  type?: string;
  dateCreated?: string;
  value?: number;
  balance?: number;
  description?: string;
  payment?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar extrato (transações financeiras) */
export interface ListStatementParams {
  offset?: number;
  limit?: number;
  /** Data inicial (YYYY-MM-DD) */
  dateFrom?: string;
  /** Data final (YYYY-MM-DD) */
  dateTo?: string;
  /** Tipo de transação (filtro opcional) */
  type?: string;
}
