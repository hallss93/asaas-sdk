import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreateSubAccountRequest,
  ListSubAccountsParams,
  SubAccount,
} from '../types/sub-account.js';

/** Serviço de Contas Asaas (subcontas) da API Asaas */
export class SubAccountService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/accounts');
  }

  /** Listar subcontas */
  list(params?: ListSubAccountsParams): Promise<PaginatedResponse<SubAccount>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<SubAccount>>(this.path(), query);
  }

  /** Recuperar uma subconta pelo ID */
  getById(id: string): Promise<SubAccount> {
    return this.http.get<SubAccount>(this.path(id));
  }

  /** Criar subconta (guarde apiKey e walletId da resposta; a apiKey não pode ser recuperada depois) */
  create(data: CreateSubAccountRequest): Promise<SubAccount> {
    return this.http.post<SubAccount>(this.path(), data);
  }
}
