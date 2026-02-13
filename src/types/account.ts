/**
 * Tipos para Informações da conta (myAccount) - API Asaas v3.
 * @see https://docs.asaas.com/reference/recuperar-dados-comerciais
 * @see https://docs.asaas.com/reference/retrieve-account-fees
 * @see https://docs.asaas.com/reference/retrieve-walletid
 */

/** Expiração dos dados comerciais (confirmação anual Bacen) */
export interface CommercialInfoExpiration {
  isExpired?: boolean;
  scheduledDate?: string;
}

/** Dados comerciais da conta (resposta GET /myAccount/commercialInfo) */
export interface CommercialInfo {
  id?: string;
  name?: string;
  email?: string;
  companyName?: string;
  cpfCnpj?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  site?: string;
  municipalInscription?: string;
  stateInscription?: string;
  commercialInfoExpiration?: CommercialInfoExpiration;
  [key: string]: unknown;
}

/** Payload para atualizar dados comerciais (POST /myAccount/commercialInfo) */
export type UpdateCommercialInfoRequest = Partial<
  Omit<CommercialInfo, 'id' | 'commercialInfoExpiration'>
>;

/** Taxas da conta (resposta GET /myAccount/fees) */
export interface AccountFees {
  creditCardFee?: number;
  creditCardFeePercent?: number;
  debitCardFee?: number;
  debitCardFeePercent?: number;
  bankSlipFee?: number;
  pixFee?: number;
  [key: string]: unknown;
}

/** Item de carteira (resposta GET /wallets) */
export interface Wallet {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

/** Resposta da listagem de carteiras */
export interface WalletListResponse {
  totalCount?: number;
  data?: Wallet[];
  [key: string]: unknown;
}

/** Configurações de personalização da fatura/checkout (GET/POST myAccount/paymentCheckoutConfig) */
export interface PaymentCheckoutConfig {
  status?: string;
  logoUrl?: string;
  backgroundColor?: string;
  infoBackgroundColor?: string;
  fontColor?: string;
  observation?: string;
  [key: string]: unknown;
}

/** Payload para salvar personalização (POST; para logo use FormData e updatePaymentCheckoutConfigFormData) */
export type UpdatePaymentCheckoutConfigRequest = Partial<PaymentCheckoutConfig>;
