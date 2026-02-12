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
export interface ListSubscriptionsParams {
  customer?: string;
  billingType?: BillingType;
  offset?: number;
  limit?: number;
  includeDeleted?: boolean;
  externalReference?: string;
}
