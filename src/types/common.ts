/** Parâmetros de listagem/paginação comuns na API Asaas */
export interface PaginationParams {
  offset?: number;
  limit?: number;
}

/** Resposta paginada padrão */
export interface PaginatedResponse<T> {
  object: 'list';
  hasMore: boolean;
  totalCount: number;
  limit: number;
  offset: number;
  data: T[];
}

/** Erro retornado pela API Asaas */
export interface AsaasApiErrorResponse {
  errors?: Array<{ code: string; description: string }>;
  code?: string;
  description?: string;
}

/** Opções de configuração do cliente */
export interface AsaasClientConfig {
  /** Chave de API. Se não informada, usa process.env.ASAAS_API_KEY */
  apiKey?: string;
  /** Ambiente: sandbox ou production. Se não informado, usa process.env.ASAAS_ENV ou 'sandbox' */
  environment?: 'sandbox' | 'production';
  /** URL base customizada (sobrescreve environment) */
  baseUrl?: string;
}
