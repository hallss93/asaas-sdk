import type { AsaasApiErrorResponse } from '../types/common.js';

/** Erro lançado quando a API Asaas retorna 4xx/5xx */
export class AsaasApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: AsaasApiErrorResponse
  ) {
    super(message);
    this.name = 'AsaasApiError';
    Object.setPrototypeOf(this, AsaasApiError.prototype);
  }
}
