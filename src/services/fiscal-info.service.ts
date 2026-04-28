import { BaseService } from './BaseService.js';
import type {
  CreateOrUpdateFiscalInfoRequest,
  FiscalInfo,
  FiscalMunicipalOptions,
  FiscalInfoMultipartFields,
} from '../types/fiscal-info.js';

function appendTextField(
  formData: FormData,
  key: string,
  value: string | number | boolean | undefined
) {
  if (value === undefined) return;
  formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
}

/**
 * Monta `FormData` para POST multipart em `/fiscalInfo` (certificado e campos da prefeitura).
 */
export function buildFiscalInfoFormData(fields: FiscalInfoMultipartFields): FormData {
  const formData = new FormData();
  appendTextField(formData, 'email', fields.email);
  appendTextField(formData, 'municipalInscription', fields.municipalInscription);
  appendTextField(formData, 'stateInscription', fields.stateInscription);
  appendTextField(formData, 'simplesNacional', fields.simplesNacional);
  appendTextField(formData, 'culturalProjectsPromoter', fields.culturalProjectsPromoter);
  appendTextField(formData, 'cnae', fields.cnae);
  appendTextField(formData, 'specialTaxRegime', fields.specialTaxRegime);
  appendTextField(formData, 'serviceListItem', fields.serviceListItem);
  appendTextField(formData, 'rpsSerie', fields.rpsSerie);
  appendTextField(formData, 'rpsNumber', fields.rpsNumber);
  appendTextField(formData, 'loteNumber', fields.loteNumber);
  appendTextField(formData, 'username', fields.username);
  appendTextField(formData, 'password', fields.password);
  appendTextField(formData, 'accessToken', fields.accessToken);
  appendTextField(formData, 'certificatePassword', fields.certificatePassword);

  if (fields.certificateFile) {
    const { file, filename } = fields.certificateFile;
    const blob = file instanceof Buffer ? new Blob([file]) : file;
    formData.append('certificateFile', blob, filename ?? 'certificate');
  }

  return formData;
}

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

  /**
   * Criar ou atualizar informações fiscais com `multipart/form-data` (ex.: upload de certificado).
   * Pode montar o corpo com {@link buildFiscalInfoFormData}.
   */
  createOrUpdateFormData(formData: FormData): Promise<FiscalInfo> {
    return this.http.postMultipart<FiscalInfo>(this.path(), formData);
  }
}
