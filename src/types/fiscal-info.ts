/**
 * Tipos para Informações fiscais (fiscalInfo) - API Asaas v3.
 * @see https://docs.asaas.com/reference/recuperar-informacoes-fiscais
 * @see https://docs.asaas.com/reference/criar-e-atualizar-informacoes-fiscais
 * @see https://docs.asaas.com/reference/listar-configuracoes-municipais
 */

/** Informações fiscais cadastradas (resposta GET /fiscalInfo) */
export interface FiscalInfo {
  id?: string;
  email?: string;
  municipalInscription?: string;
  cnae?: string;
  taxRegime?: string;
  specialTaxRegime?: string;
  serviceListItem?: string;
  [key: string]: unknown;
}

/** Payload para criar/atualizar informações fiscais (POST /fiscalInfo) */
export interface CreateOrUpdateFiscalInfoRequest {
  email?: string;
  municipalInscription?: string;
  cnae?: string;
  taxRegime?: string;
  specialTaxRegime?: string;
  serviceListItem?: string;
  /** Credenciais conforme authenticationType das opções municipais (certificado, token, user/password) */
  credentials?: Record<string, string>;
  [key: string]: unknown;
}

/** Arquivo de certificado digital para envio em multipart (POST /fiscalInfo) */
export interface FiscalInfoCertificateFile {
  file: Blob | Buffer | File;
  /** Nome do arquivo no multipart (obrigatório para `Blob`/`Buffer` no Node) */
  filename?: string;
}

/**
 * Campos usados em `multipart/form-data` para criar/atualizar informações fiscais.
 * Alinhado ao fluxo da coleção Postman e à referência da API; omita o que não se aplica ao seu município.
 * @see https://docs.asaas.com/reference/criar-e-atualizar-informacoes-fiscais
 */
export interface FiscalInfoMultipartFields {
  email?: string;
  municipalInscription?: string;
  stateInscription?: string;
  simplesNacional?: boolean | string;
  culturalProjectsPromoter?: boolean | string;
  cnae?: string;
  specialTaxRegime?: string;
  serviceListItem?: string;
  rpsSerie?: string;
  rpsNumber?: number | string;
  loteNumber?: number | string;
  username?: string;
  password?: string;
  accessToken?: string;
  certificatePassword?: string;
  certificateFile?: FiscalInfoCertificateFile;
}

/** Tipo de autenticação exigido pela prefeitura */
export type FiscalAuthenticationType = 'CERTIFICATE' | 'TOKEN' | 'USER_AND_PASSWORD';

/** Opção de regime tributário especial */
export interface SpecialTaxRegimeOption {
  label?: string;
  value?: string;
}

/** Configurações municipais (resposta GET /fiscalInfo/municipalOptions) */
export interface FiscalMunicipalOptions {
  authenticationType?: FiscalAuthenticationType;
  supportsCancellation?: boolean;
  usesSpecialTaxRegimes?: boolean;
  usesServiceListItem?: boolean;
  specialTaxRegimesList?: SpecialTaxRegimeOption[];
  municipalInscriptionHelp?: string;
  specialTaxRegimeHelp?: string;
  serviceListItemHelp?: string;
  digitalCertificatedHelp?: string;
  accessTokenHelp?: string;
  municipalServiceCodeHelp?: string;
  [key: string]: unknown;
}
