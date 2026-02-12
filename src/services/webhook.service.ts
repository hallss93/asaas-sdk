import { BaseService } from './BaseService.js';
import type { UpdateWebhookRequest, WebhookSettings } from '../types/webhook.js';

/** Serviço de Webhooks da API Asaas (cobrança e nota fiscal) */
export class WebhookService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/webhook');
  }

  /** Recuperar configurações do webhook de cobrança */
  async getPayment(): Promise<WebhookSettings> {
    return this.http.get<WebhookSettings>(this.path());
  }

  /** Criar ou atualizar configurações do webhook de cobrança (API usa POST) */
  async updatePayment(data: UpdateWebhookRequest): Promise<WebhookSettings> {
    return this.http.post<WebhookSettings>(this.path(), data);
  }

  /** Recuperar configurações do webhook de notas fiscais */
  async getInvoice(): Promise<WebhookSettings> {
    return this.http.get<WebhookSettings>(this.path('invoice'));
  }

  /** Criar ou atualizar configurações do webhook de notas fiscais (API usa POST) */
  async updateInvoice(data: UpdateWebhookRequest): Promise<WebhookSettings> {
    return this.http.post<WebhookSettings>(this.path('invoice'), data);
  }
}
