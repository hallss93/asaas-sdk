import { BaseService } from './BaseService.js';
import type { CreditBureauReport, CreditBureauReportRequest } from '../types/credit-bureau.js';

/** Serviço de Consulta Serasa (bureau de crédito) da API Asaas */
export class CreditBureauService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/creditBureauReport');
  }

  /** Realizar consulta Serasa (informe customer ou customerData com cpfCnpj) */
  consult(request: CreditBureauReportRequest): Promise<CreditBureauReport> {
    return this.http.post<CreditBureauReport>(this.path(), request);
  }
}
