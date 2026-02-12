/** Tipo de cobrança do link */
export type PaymentLinkChargeType = 'DETACHED' | 'INSTALLMENT' | 'RECURRENT';

/** Payload para criar link de pagamento */
export interface CreatePaymentLinkRequest {
  name: string;
  description?: string;
  endDate?: string;
  value: number;
  billingType: string;
  chargeType: PaymentLinkChargeType;
  dueDateLimitDays?: number;
  subscriptionCycle?: string | null;
  maxInstallmentCount?: number;
  notificationEnabled?: boolean;
}

/** Payload para atualizar link de pagamento */
export interface UpdatePaymentLinkRequest {
  name?: string;
  description?: string;
  endDate?: string;
  value?: number;
  active?: boolean;
  billingType?: string;
  chargeType?: PaymentLinkChargeType;
  dueDateLimitDays?: number;
  subscriptionCycle?: string | null;
  maxInstallmentCount?: number;
  notificationEnabled?: boolean;
}

/** Link de pagamento retornado pela API */
export interface PaymentLink {
  id: string;
  dateCreated: string;
  name: string;
  description?: string;
  endDate?: string;
  value: number;
  billingType: string;
  chargeType: PaymentLinkChargeType;
  active: boolean;
  url?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar links de pagamento */
export interface ListPaymentLinksParams {
  active?: boolean;
  includeDeleted?: boolean;
  name?: string;
  offset?: number;
  limit?: number;
}

/** Imagem de um link de pagamento retornada pela API */
export interface PaymentLinkImage {
  id: string;
  dateCreated?: string;
  main?: boolean;
  imageUrl?: string;
  [key: string]: unknown;
}
