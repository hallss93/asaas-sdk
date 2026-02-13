import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type { FinancialTransaction, ListStatementParams } from '../types/statement.js';

/** Serviço de Extrato (transações financeiras) da API Asaas */
export class StatementService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/financialTransactions');
  }

  /** Listar transações do extrato (filtro por período, tipo, paginação) */
  list(params?: ListStatementParams): Promise<PaginatedResponse<FinancialTransaction>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<FinancialTransaction>>(this.path(), query);
  }
}
