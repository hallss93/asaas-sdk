/**
 * URLs base da API Asaas por ambiente.
 * @see https://docs.asaas.com/reference/comece-por-aqui
 */
export const ASAAS_BASE_URL = {
  sandbox: 'https://sandbox.asaas.com',
  production: 'https://www.asaas.com',
} as const;

export type AsaasEnvironment = keyof typeof ASAAS_BASE_URL;

export const DEFAULT_ENV: AsaasEnvironment = 'sandbox';

export const API_VERSION = 'v3';

export const HEADER_ACCESS_TOKEN = 'access_token' as const;
