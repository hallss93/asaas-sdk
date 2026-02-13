/**
 * Tipos para Contas Asaas (subcontas) - API Asaas v3.
 * @see https://docs.asaas.com/reference/listar-subcontas
 * @see https://docs.asaas.com/reference/criar-subconta
 * @see https://docs.asaas.com/reference/retrieve-a-single-subaccount
 */

/** Subconta Asaas */
export interface SubAccount {
  id?: string;
  name?: string;
  email?: string;
  cpfCnpj?: string;
  birthDate?: string;
  companyType?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  /** Chave de API (retornada apenas na criação; guarde-a, não é possível recuperar depois) */
  apiKey?: string;
  walletId?: string;
  dateCreated?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar subcontas */
export interface ListSubAccountsParams {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
  cpfCnpj?: string;
}

/** Payload para criar subconta (cpfCnpj apenas números) */
export interface CreateSubAccountRequest {
  name: string;
  email: string;
  cpfCnpj: string;
  birthDate?: string;
  companyType?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  [key: string]: unknown;
}
