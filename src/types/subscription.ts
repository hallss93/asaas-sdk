import type { PaginationParams } from './common.js';
import type {
  BillingType,
  CreditCard,
  CreditCardHolderInfo,
  Discount,
  Fine,
  Interest,
} from './payment.js';

/** Ciclo da assinatura */
export type SubscriptionCycle =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'BIMONTHLY'
  | 'QUARTERLY'
  | 'SEMIANNUALLY'
  | 'YEARLY';

/** Payload para criar assinatura */
export interface CreateSubscriptionRequest {
  customer: string;
  billingType: BillingType;
  nextDueDate: string;
  value: number;
  cycle: SubscriptionCycle;
  description?: string;
  externalReference?: string;
  discount?: Discount;
  fine?: Fine;
  interest?: Interest;
  endDate?: string;
  maxPayments?: number;
  creditCard?: CreditCard;
  creditCardHolderInfo?: CreditCardHolderInfo;
  creditCardToken?: string;
}

/** Payload para atualizar assinatura */
export interface UpdateSubscriptionRequest {
  billingType?: BillingType;
  nextDueDate?: string;
  value?: number;
  cycle?: SubscriptionCycle;
  description?: string;
  externalReference?: string;
  updatePendingPayments?: boolean;
  discount?: Discount;
  fine?: Fine;
  interest?: Interest;
  endDate?: string;
}

/** Assinatura retornada pela API */
export interface Subscription {
  id: string;
  dateCreated: string;
  customer: string;
  paymentLink?: string;
  billingType: BillingType;
  value: number;
  nextDueDate: string;
  cycle: SubscriptionCycle;
  description?: string;
  externalReference?: string;
  status: string;
  deleted?: boolean;
  [key: string]: unknown;
}

/** Parâmetros para listar assinaturas */
export interface ListSubscriptionsParams extends PaginationParams {
  customer?: string;
  billingType?: BillingType;
  includeDeleted?: boolean;
  externalReference?: string;
}

/** Parâmetros para listar notas fiscais de uma assinatura */
export interface ListSubscriptionInvoicesParams extends PaginationParams {
  status?: string;
}

/** Impostos da configuração de NF para assinatura */
export interface SubscriptionInvoiceTaxes {
  retainIss?: boolean;
  iss?: number;
  cofins?: number;
  csll?: number;
  inss?: number;
  ir?: number;
  pis?: number;
}

/** Payload para criar/atualizar configuração de NF da assinatura */
export interface SubscriptionInvoiceSettingsRequest {
  municipalServiceId?: number | null;
  municipalServiceCode?: string;
  municipalServiceName?: string;
  deductions?: number;
  taxes?: SubscriptionInvoiceTaxes;
  effectiveDatePeriod?: 'ON_PAYMENT_CONFIRMATION' | 'ON_PAYMENT_DUE_DATE';
  daysBeforeDueDate?: number | null;
  receivedOnly?: boolean | null;
  observations?: string;
}

/** Configuração de NF da assinatura retornada pela API */
export interface SubscriptionInvoiceSettings {
  municipalServiceId?: number | null;
  municipalServiceCode?: string;
  municipalServiceName?: string;
  deductions?: number;
  taxes?: SubscriptionInvoiceTaxes;
  effectiveDatePeriod?: string;
  daysBeforeDueDate?: number | null;
  receivedOnly?: boolean | null;
  observations?: string;
  [key: string]: unknown;
}
