import { ASAAS_BASE_URL, DEFAULT_ENV, type AsaasEnvironment } from '../constants/index.js';
import { HttpClient } from '../http/HttpClient.js';
import { AccountService } from '../services/account.service.js';
import { AnticipationService } from '../services/anticipation.service.js';
import { CustomerService } from '../services/customer.service.js';
import { InstallmentService } from '../services/installment.service.js';
import { NotificationService } from '../services/notification.service.js';
import { PaymentLinkService } from '../services/payment-link.service.js';
import { PixService } from '../services/pix.service.js';
import { PaymentService } from '../services/payment.service.js';
import { SubscriptionService } from '../services/subscription.service.js';
import { TransferService } from '../services/transfer.service.js';
import { WebhookService } from '../services/webhook.service.js';
import type { AsaasClientConfig } from '../types/common.js';

function getApiKey(config?: AsaasClientConfig): string {
  const fromConfig = config?.apiKey?.trim();
  const fromEnv = typeof process !== 'undefined' && process.env?.ASAAS_API_KEY?.trim();
  const key = fromConfig ?? fromEnv;
  if (!key) {
    throw new Error(
      'Asaas API Key is required. Set ASAAS_API_KEY in env or pass apiKey in config.'
    );
  }
  return key;
}

function getBaseUrl(config?: AsaasClientConfig): string {
  if (config?.baseUrl?.trim()) {
    return config.baseUrl.replace(/\/$/, '');
  }
  const envRaw =
    config?.environment ??
    (typeof process !== 'undefined' ? process.env?.ASAAS_ENV : undefined) ??
    DEFAULT_ENV;
  const env: AsaasEnvironment =
    envRaw === 'production' || envRaw === 'sandbox' ? envRaw : DEFAULT_ENV;
  return ASAAS_BASE_URL[env];
}

/**
 * Cliente principal do SDK Asaas.
 * Aceita configuração por parâmetro e/ou variáveis de ambiente (ASAAS_API_KEY, ASAAS_ENV).
 */
export class AsaasClient {
  private readonly http: HttpClient;
  readonly account: AccountService;
  readonly anticipations: AnticipationService;
  readonly customers: CustomerService;
  readonly installments: InstallmentService;
  readonly payments: PaymentService;
  readonly notifications: NotificationService;
  readonly paymentLinks: PaymentLinkService;
  readonly pix: PixService;
  readonly subscriptions: SubscriptionService;
  readonly transfers: TransferService;
  readonly webhooks: WebhookService;

  constructor(config?: AsaasClientConfig) {
    const apiKey = getApiKey(config);
    const baseUrl = getBaseUrl(config);
    this.http = new HttpClient({ baseUrl, apiKey });
    this.account = new AccountService(this.http);
    this.anticipations = new AnticipationService(this.http);
    this.customers = new CustomerService(this.http);
    this.installments = new InstallmentService(this.http);
    this.payments = new PaymentService(this.http);
    this.notifications = new NotificationService(this.http);
    this.paymentLinks = new PaymentLinkService(this.http);
    this.pix = new PixService(this.http);
    this.subscriptions = new SubscriptionService(this.http);
    this.transfers = new TransferService(this.http);
    this.webhooks = new WebhookService(this.http);
  }
}
