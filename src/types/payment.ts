import type { PaginationParams } from './common.js';

/** Formas de cobrança */
export type BillingType = 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'UNDEFINED';

/** Status de cobrança */
export type PaymentStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'DELETED'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH';

/** Desconto */
export interface Discount {
  value: number;
  dueDateLimitDays: number;
}

/** Multa */
export interface Fine {
  value: number;
}

/** Juros */
export interface Interest {
  value: number;
}

/** Dados do cartão (quando não usar token) */
export interface CreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

/** Dados do titular do cartão */
export interface CreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string | null;
  phone: string;
  mobilePhone: string;
}

/** Split de pagamento */
export interface SplitItem {
  walletId: string;
  fixedValue?: number;
  percentualValue?: number;
}

/** Payload para criar cobrança */
export interface CreatePaymentRequest {
  customer: string;
  billingType: BillingType;
  dueDate: string;
  value: number;
  description?: string;
  externalReference?: string;
  discount?: Discount;
  fine?: Fine;
  interest?: Interest;
  postalService?: boolean;
  installmentCount?: number;
  installmentValue?: number;
  totalValue?: number;
  creditCard?: CreditCard;
  creditCardHolderInfo?: CreditCardHolderInfo;
  creditCardToken?: string;
  split?: SplitItem[];
}

/** Payload para atualizar cobrança */
export interface UpdatePaymentRequest {
  billingType?: BillingType;
  dueDate?: string;
  value?: number;
  description?: string;
  externalReference?: string;
  discount?: Discount;
  fine?: Fine;
  interest?: Interest;
  postalService?: boolean;
}

/** Resposta da linha digitável do boleto (GET /payments/:id/identificationField) */
export interface PaymentIdentificationField {
  identificationField: string;
}

/** Resposta do QR Code PIX da cobrança (GET /payments/:id/pixQrCode) */
export interface PaymentPixQrCodeResponse {
  encodedImage: string;
  payload: string;
  expirationDate?: string;
}

/** Cobrança retornada pela API */
export interface Payment {
  id: string;
  dateCreated: string;
  customer: string;
  paymentLink?: string;
  dueDate: string;
  value: number;
  netValue?: number;
  billingType: BillingType;
  status: PaymentStatus;
  description?: string;
  externalReference?: string;
  confirmedDate?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentNumber?: number;
  deleted?: boolean;
  anticipated?: boolean;
  anticipable?: boolean;
  creditCard?: unknown;
  [key: string]: unknown;
}

/** Filtros para listar cobranças */
export interface ListPaymentsParams extends PaginationParams {
  customer?: string;
  billingType?: BillingType;
  status?: PaymentStatus;
  subscription?: string;
  installment?: string;
  externalReference?: string;
  paymentDate?: string;
  anticipated?: boolean;
  'paymentDate[ge]'?: string;
  'paymentDate[le]'?: string;
  'dueDate[ge]'?: string;
  'dueDate[le]'?: string;
}
