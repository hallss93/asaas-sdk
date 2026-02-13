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
