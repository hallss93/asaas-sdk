import { HEADER_ACCESS_TOKEN } from '../constants/index.js';
import { AsaasApiError } from '../errors/AsaasApiError.js';
import type { AsaasApiErrorResponse } from '../types/common.js';

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
}

/**
 * Cliente HTTP para a API Asaas v3.
 * Usa fetch nativo (Node 18+).
 */
export class HttpClient {
  constructor(private readonly config: HttpClientConfig) {
    if (!config.apiKey?.trim()) {
      throw new Error('Asaas API Key is required');
    }
    if (!config.baseUrl?.trim()) {
      throw new Error('Asaas base URL is required');
    }
  }

  private getHeaders(omitContentType = false): Record<string, string> {
    const headers: Record<string, string> = {
      [HEADER_ACCESS_TOKEN]: this.config.apiKey,
    };
    if (!omitContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let body: T | AsaasApiErrorResponse | undefined;
    try {
      body = text ? (JSON.parse(text) as T) : undefined;
    } catch {
      body = undefined;
    }

    if (!res.ok) {
      const errBody = body as AsaasApiErrorResponse | undefined;
      const message =
        errBody?.errors?.[0]?.description ?? errBody?.description ?? `HTTP ${res.status}`;
      throw new AsaasApiError(message, res.status, errBody);
    }

    return body as T;
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const pathWithBase = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
    const url = new URL(pathWithBase);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
      });
    }
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(res);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const pathWithBase = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
    const res = await fetch(pathWithBase, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const pathWithBase = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
    const res = await fetch(pathWithBase, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  async delete<T>(path: string): Promise<T> {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const pathWithBase = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
    const res = await fetch(pathWithBase, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(res);
  }

  /** POST com multipart/form-data (ex.: upload de arquivo). Não define Content-Type para fetch definir o boundary. */
  async postMultipart<T>(path: string, formData: FormData): Promise<T> {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const pathWithBase = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
    const res = await fetch(pathWithBase, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData,
    });
    return this.handleResponse<T>(res);
  }
}
