/**
 * Tipos para Pix (chaves e QR Code estático) - API Asaas v3.
 * @see https://docs.asaas.com/reference/criar-uma-chave
 * @see https://docs.asaas.com/reference/listar-chaves
 * @see https://docs.asaas.com/reference/criar-qrcode-estatico
 */

/** Tipo de chave Pix (EVP = chave aleatória) */
export type PixAddressKeyType = 'EVP';

/** Payload para criar chave Pix (apenas EVP suportado pela API) */
export interface CreatePixAddressKeyRequest {
  type: PixAddressKeyType;
}

/** Chave Pix (endereço) retornada pela API */
export interface PixAddressKey {
  id?: string;
  key?: string;
  type?: string;
  status?: string;
  dateCreated?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar chaves Pix */
export interface ListPixAddressKeysParams {
  offset?: number;
  limit?: number;
}

/** Payload para criar QR Code estático Pix */
export interface CreateStaticPixQrCodeRequest {
  /** ID da chave Pix que receberá o pagamento */
  addressKey: string;
  /** Descrição do QR Code */
  description?: string;
  /** Valor em reais (opcional para QR sem valor fixo) */
  value?: number;
  /** Formato do QR Code (ex: "ALL") */
  format?: string;
  /** Data de expiração (opcional) */
  expirationDate?: string;
  /** Segundos até expiração (opcional) */
  expirationSeconds?: number | null;
}

/** Resposta da criação de QR Code estático (payload em Base64) */
export interface StaticPixQrCode {
  id?: string;
  /** Imagem do QR Code em Base64 */
  payload?: string;
  [key: string]: unknown;
}

/**
 * Transação Pix.
 * @see https://docs.asaas.com/reference/listar-transacoes
 */
export interface PixTransaction {
  id?: string;
  type?: string;
  value?: number;
  status?: string;
  dateCreated?: string;
  [key: string]: unknown;
}

/** Parâmetros para listar transações Pix */
export interface ListPixTransactionsParams {
  offset?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
}
