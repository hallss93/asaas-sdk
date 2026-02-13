import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Bill,
  CreateBillRequest,
  ListBillsParams,
  SimulateBillResponse,
} from '../types/bill.js';

/** Serviço de Pagamento de contas (bill) da API Asaas */
export class BillService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/bill');
  }

  /** Listar pagamentos de conta */
  list(params?: ListBillsParams): Promise<PaginatedResponse<Bill>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<Bill>>(this.path(), query);
  }

  /** Recuperar um pagamento de conta pelo ID */
  getById(id: string): Promise<Bill> {
    return this.http.get<Bill>(this.path(id));
  }

  /** Simular pagamento de conta (valor e vencimento a partir da linha digitável) */
  simulate(identificationField: string): Promise<SimulateBillResponse> {
    return this.http.post<SimulateBillResponse>(this.path('simulate'), {
      identificationField,
    });
  }

  /** Criar/agendar pagamento de conta (linha digitável do boleto) */
  create(data: CreateBillRequest): Promise<Bill> {
    return this.http.post<Bill>(this.path(), data);
  }

  /** Cancelar pagamento de conta (verifique canBeCancelled no objeto antes) */
  cancel(id: string): Promise<Bill> {
    return this.http.post<Bill>(this.path(`${id}/cancel`));
  }
}
