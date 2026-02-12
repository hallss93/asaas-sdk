import type { HttpClient } from '../http/HttpClient.js';

const API_PREFIX = '/api/v3';

/**
 * Serviço base que recebe o HttpClient e o path do recurso.
 * Todos os serviços concretos estendem esta classe.
 */
export abstract class BaseService {
  constructor(
    protected readonly http: HttpClient,
    protected readonly basePath: string
  ) {}

  protected path(segment?: string): string {
    const p = `${API_PREFIX}${this.basePath}`;
    return segment ? `${p}/${segment}` : p;
  }
}
