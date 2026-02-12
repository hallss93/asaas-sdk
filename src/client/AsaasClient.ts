import { ASAAS_BASE_URL, DEFAULT_ENV, type AsaasEnvironment } from '../constants/index.js';
import { HttpClient } from '../http/HttpClient.js';
import { CustomerService } from '../services/customer.service.js';
import { InstallmentService } from '../services/installment.service.js';
import { PaymentLinkService } from '../services/payment-link.service.js';
import { PaymentService } from '../services/payment.service.js';
import { SubscriptionService } from '../services/subscription.service.js';
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
  readonly customers: CustomerService;
  readonly payments: PaymentService;
  readonly installments: InstallmentService;
  readonly subscriptions: SubscriptionService;
  readonly paymentLinks: PaymentLinkService;

  constructor(config?: AsaasClientConfig) {
    const apiKey = getApiKey(config);
    const baseUrl = getBaseUrl(config);
    this.http = new HttpClient({ baseUrl, apiKey });
    this.customers = new CustomerService(this.http);
    this.payments = new PaymentService(this.http);
    this.installments = new InstallmentService(this.http);
    this.subscriptions = new SubscriptionService(this.http);
    this.paymentLinks = new PaymentLinkService(this.http);
  }
}
