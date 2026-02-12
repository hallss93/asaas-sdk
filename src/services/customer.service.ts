import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '../types/customer.js';
import type { PaginationParams } from '../types/common.js';

/** Serviço de Clientes da API Asaas (POST/GET/PUT/DELETE/restore) */
export class CustomerService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/customers');
  }

  /** Criar novo cliente */
  async create(data: CreateCustomerRequest): Promise<Customer> {
    return this.http.post<Customer>(this.path(), data);
  }

  /** Recuperar um único cliente */
  async getById(id: string): Promise<Customer> {
    return this.http.get<Customer>(this.path(id));
  }

  /** Listar clientes com filtros e paginação */
  async list(
    params?: PaginationParams & {
      name?: string;
      email?: string;
      cpfCnpj?: string;
      groupName?: string;
      externalReference?: string;
    }
  ): Promise<PaginatedResponse<Customer>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<Customer>>(this.path(), query);
  }

  /** Atualizar cliente existente (API usa POST no mesmo path) */
  async update(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    return this.http.post<Customer>(this.path(id), data);
  }

  /** Remover cliente */
  async delete(id: string): Promise<Customer> {
    return this.http.delete<Customer>(this.path(id));
  }

  /** Restaurar cliente removido */
  async restore(id: string): Promise<Customer> {
    return this.http.post<Customer>(this.path(`${id}/restore`));
  }
}
