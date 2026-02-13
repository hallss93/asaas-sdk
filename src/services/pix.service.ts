import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreatePixAddressKeyRequest,
  CreateStaticPixQrCodeRequest,
  ListPixAddressKeysParams,
  ListPixTransactionsParams,
  PixAddressKey,
  PixTransaction,
  StaticPixQrCode,
} from '../types/pix.js';

/** Serviço Pix da API Asaas (chaves e QR Code estático) */
export class PixService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/pix');
  }

  /** Criar uma chave Pix (EVP - chave aleatória) */
  createAddressKey(data: CreatePixAddressKeyRequest): Promise<PixAddressKey> {
    return this.http.post<PixAddressKey>(this.path('addressKeys'), data);
  }

  /** Listar chaves Pix */
  listAddressKeys(params?: ListPixAddressKeysParams): Promise<PaginatedResponse<PixAddressKey>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PixAddressKey>>(this.path('addressKeys'), query);
  }

  /** Recuperar uma chave Pix pelo ID */
  getAddressKeyById(id: string): Promise<PixAddressKey> {
    return this.http.get<PixAddressKey>(this.path(`addressKeys/${id}`));
  }

  /** Remover uma chave Pix */
  deleteAddressKey(id: string): Promise<PixAddressKey> {
    return this.http.delete<PixAddressKey>(this.path(`addressKeys/${id}`));
  }

  /** Criar QR Code estático Pix */
  createStaticQrCode(data: CreateStaticPixQrCodeRequest): Promise<StaticPixQrCode> {
    return this.http.post<StaticPixQrCode>(this.path('qrCodes/static'), data);
  }

  /** Listar transações Pix */
  listTransactions(params?: ListPixTransactionsParams): Promise<PaginatedResponse<PixTransaction>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<PixTransaction>>(this.path('transactions'), query);
  }
}
