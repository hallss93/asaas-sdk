import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreditBureauListParams,
  CreditBureauReport,
  CreditBureauReportRequest,
} from '../types/credit-bureau.js';

/** Serviço de Consulta Serasa (bureau de crédito) da API Asaas */
export class CreditBureauService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/creditBureauReport');
  }

  /** Realizar consulta Serasa (informe customer ou customerData com cpfCnpj) */
  consult(request: CreditBureauReportRequest): Promise<CreditBureauReport> {
    return this.http.post<CreditBureauReport>(this.path(), request);
  }

  /** Recuperar uma consulta Serasa por ID */
  getById(id: string): Promise<CreditBureauReport> {
    return this.http.get<CreditBureauReport>(this.path(id));
  }

  /** Listar consultas Serasa (por período e paginação) */
  list(params?: CreditBureauListParams): Promise<PaginatedResponse<CreditBureauReport>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<CreditBureauReport>>(this.path(), query);
  }
}
