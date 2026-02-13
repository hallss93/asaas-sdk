import { BaseService } from './BaseService.js';
import type {
  CreateOrUpdateFiscalInfoRequest,
  FiscalInfo,
  FiscalMunicipalOptions,
} from '../types/fiscal-info.js';

/** Serviço de Informações fiscais da API Asaas */
export class FiscalInfoService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/fiscalInfo');
  }

  /** Recuperar informações fiscais cadastradas (404 se ainda não configurado) */
  get(): Promise<FiscalInfo> {
    return this.http.get<FiscalInfo>(this.path());
  }

  /** Listar configurações exigidas pela prefeitura do município (conforme CNPJ da conta) */
  getMunicipalOptions(): Promise<FiscalMunicipalOptions> {
    return this.http.get<FiscalMunicipalOptions>(this.path('municipalOptions'));
  }

  /** Criar ou atualizar informações fiscais para emissão de notas fiscais */
  createOrUpdate(data: CreateOrUpdateFiscalInfoRequest): Promise<FiscalInfo> {
    return this.http.post<FiscalInfo>(this.path(), data);
  }
}
