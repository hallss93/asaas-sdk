import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  CreatePaymentLinkRequest,
  ListPaymentLinksParams,
  PaymentLink,
  PaymentLinkImage,
  UpdatePaymentLinkRequest,
} from '../types/payment-link.js';

/** Serviço de Links de Pagamento da API Asaas */
export class PaymentLinkService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/paymentLinks');
  }

  /** Criar um link de pagamentos */
  async create(data: CreatePaymentLinkRequest): Promise<PaymentLink> {
    return this.http.post<PaymentLink>(this.path(), data);
  }

  /** Recuperar um único link de pagamentos */
  async getById(id: string): Promise<PaymentLink> {
    return this.http.get<PaymentLink>(this.path(id));
  }

  /** Listar links de pagamento */
  async list(params?: ListPaymentLinksParams): Promise<PaginatedResponse<PaymentLink>> {
    const query = params as Record<string, string | number | boolean | undefined>;
    return this.http.get<PaginatedResponse<PaymentLink>>(this.path(), query);
  }

  /** Atualizar um link de pagamentos */
  async update(id: string, data: UpdatePaymentLinkRequest): Promise<PaymentLink> {
    return this.http.put<PaymentLink>(this.path(id), data);
  }

  /** Remover um link de pagamentos */
  async delete(id: string): Promise<PaymentLink> {
    return this.http.delete<PaymentLink>(this.path(id));
  }

  /** Restaurar um link de pagamentos */
  async restore(id: string): Promise<PaymentLink> {
    return this.http.post<PaymentLink>(this.path(`${id}/restore`));
  }

  /** Adicionar uma imagem ao link de pagamentos (multipart: main, image) */
  async addImage(
    linkId: string,
    params: { main?: boolean; image: Blob | Buffer; filename?: string }
  ): Promise<PaymentLinkImage> {
    const formData = new FormData();
    formData.append('main', String(params.main ?? false));
    const file = params.image instanceof Buffer ? new Blob([params.image]) : params.image;
    const name = params.filename ?? 'image';
    formData.append('image', file, name);
    return this.http.postMultipart<PaymentLinkImage>(this.path(`${linkId}/images`), formData);
  }

  /** Listar imagens de um link de pagamentos */
  async listImages(linkId: string): Promise<PaymentLinkImage[]> {
    const res = await this.http.get<{ data?: PaymentLinkImage[] }>(this.path(`${linkId}/images`));
    return res.data ?? [];
  }

  /** Recuperar uma única imagem do link de pagamentos */
  async getImage(linkId: string, imageId: string): Promise<PaymentLinkImage> {
    return this.http.get<PaymentLinkImage>(this.path(`${linkId}/images/${imageId}`));
  }

  /** Remover uma imagem do link de pagamentos */
  async deleteImage(linkId: string, imageId: string): Promise<void> {
    await this.http.delete<unknown>(this.path(`${linkId}/images/${imageId}`));
  }

  /** Definir imagem principal do link de pagamentos */
  async setImageAsMain(linkId: string, imageId: string): Promise<PaymentLinkImage> {
    return this.http.post<PaymentLinkImage>(this.path(`${linkId}/images/${imageId}/setAsMain`), {});
  }
}
