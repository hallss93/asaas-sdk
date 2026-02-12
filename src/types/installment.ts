/** Parcelamento retornado pela API */
export interface Installment {
  id: string;
  dateCreated: string;
  customer: string;
  paymentLink?: string;
  dueDate: string;
  value: number;
  installmentCount: number;
  installmentNumber: number;
  status: string;
  description?: string;
  externalReference?: string;
  deleted?: boolean;
  [key: string]: unknown;
}

/** Parâmetros para listar parcelamentos */
export interface ListInstallmentsParams {
  offset?: number;
  limit?: number;
}
