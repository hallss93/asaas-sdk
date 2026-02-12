/** Dados do banco para transferência */
export interface TransferBankInfo {
  code: string;
}

/** Conta bancária para transferência */
export interface TransferBankAccount {
  bank: TransferBankInfo;
  accountName: string;
  ownerName: string;
  ownerBirthDate: string;
  cpfCnpj: string;
  agency: string;
  account: string;
  accountDigit: string;
  bankAccountType: 'CONTA_CORRENTE' | 'CONTA_POUPANCA';
}

/** Payload para transferir para conta bancária */
export interface CreateTransferToBankRequest {
  value: number;
  bankAccount: TransferBankAccount;
}

/** Payload para transferir para conta Asaas */
export interface CreateTransferToAsaasRequest {
  value: number;
  walletId: string;
}

/** Transferência retornada pela API */
export interface Transfer {
  id: string;
  dateCreated: string;
  value: number;
  status: string;
  type?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar transferências */
export interface ListTransfersParams {
  dateCreated?: string;
  type?: string;
  offset?: number;
  limit?: number;
}
