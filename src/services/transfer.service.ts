import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreateTransferToAsaasRequest,
  CreateTransferToBankRequest,
  ListTransfersParams,
  Transfer,
} from '../types/transfer.js';

/** Serviço de Transferências da API Asaas */
export class TransferService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/transfers');
  }

  /** Transferir para conta bancária ou chave Pix */
  async createToBank(data: CreateTransferToBankRequest): Promise<Transfer> {
    return this.http.post<Transfer>(this.path(), data);
  }

  /** Transferir para conta Asaas */
  async createToAsaas(data: CreateTransferToAsaasRequest): Promise<Transfer> {
    return this.http.post<Transfer>(this.path(), data);
  }

  /** Recuperar uma única transferência */
  async getById(id: string): Promise<Transfer> {
    return this.http.get<Transfer>(this.path(id));
  }

  /** Listar transferências */
  async list(params?: ListTransfersParams): Promise<PaginatedResponse<Transfer>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<Transfer>>(this.path(), query);
  }
}
