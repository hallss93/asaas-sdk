/**
 * Tipos para Consulta Serasa (relatório de bureau de crédito) - API Asaas v3.
 * @see https://docs.asaas.com/reference/realizar-consulta
 */

/** Dados do cliente para consulta (use quando não tiver ID de cliente) */
export interface CreditBureauCustomerData {
  cpfCnpj: string;
  name?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  [key: string]: unknown;
}

/** Payload para realizar consulta Serasa (use customer OU customerData, não ambos) */
export interface CreditBureauReportRequest {
  /** ID do cliente já cadastrado no Asaas */
  customer?: string;
  /** Dados do cliente para consulta (cpfCnpj obrigatório) */
  customerData?: CreditBureauCustomerData;
}

/** Resposta da consulta Serasa (estrutura conforme retorno da API) */
export interface CreditBureauReport {
  id?: string;
  status?: string;
  customer?: string;
  dateCreated?: string;
  [key: string]: unknown;
}
