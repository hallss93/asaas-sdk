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

  /** Path relativo ao basePath do serviço (ex.: path('fees') → /api/v3/myAccount/fees). */
  protected path(segment?: string): string {
    const p = `${API_PREFIX}${this.basePath}`;
    return segment ? `${p}/${segment}` : p;
  }

  /** Path absoluto na API, fora do basePath do serviço (ex.: pathAbsolute('wallets') → /api/v3/wallets). */
  protected pathAbsolute(segment: string): string {
    const s = segment.startsWith('/') ? segment.slice(1) : segment;
    return `${API_PREFIX}/${s}`;
  }
}
