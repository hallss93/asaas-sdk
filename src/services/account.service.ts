import { BaseService } from './BaseService.js';
import type {
  AccountFees,
  CommercialInfo,
  PaymentCheckoutConfig,
  UpdateCommercialInfoRequest,
  UpdatePaymentCheckoutConfigRequest,
  WalletListResponse,
} from '../types/account.js';

/** Serviço de Informações da conta (myAccount) da API Asaas */
export class AccountService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/myAccount');
  }

  /** Recuperar dados comerciais da conta */
  getCommercialInfo(): Promise<CommercialInfo> {
    return this.http.get<CommercialInfo>(this.path('commercialInfo'));
  }

  /** Atualizar dados comerciais da conta */
  updateCommercialInfo(data: UpdateCommercialInfoRequest): Promise<CommercialInfo> {
    return this.http.post<CommercialInfo>(this.path('commercialInfo'), data);
  }

  /** Recuperar taxas da conta */
  getFees(): Promise<AccountFees> {
    return this.http.get<AccountFees>(this.path('fees'));
  }

  /** Recuperar carteiras (WalletId e lista de carteiras); endpoint /wallets não é subpath de myAccount. */
  getWallets(): Promise<WalletListResponse> {
    return this.http.get<WalletListResponse>(this.pathAbsolute('wallets'));
  }

  /** Recuperar configurações de personalização da fatura (checkout) */
  getPaymentCheckoutConfig(): Promise<PaymentCheckoutConfig> {
    return this.http.get<PaymentCheckoutConfig>(this.path('paymentCheckoutConfig/'));
  }

  /** Salvar personalização da fatura (JSON). Para envio de logo use formData com multipart. */
  updatePaymentCheckoutConfig(
    data: UpdatePaymentCheckoutConfigRequest
  ): Promise<PaymentCheckoutConfig> {
    return this.http.post<PaymentCheckoutConfig>(this.path('paymentCheckoutConfig/'), data);
  }

  /** Salvar personalização da fatura com logo (multipart/form-data) */
  updatePaymentCheckoutConfigFormData(formData: FormData): Promise<PaymentCheckoutConfig> {
    return this.http.postMultipart<PaymentCheckoutConfig>(
      this.path('paymentCheckoutConfig/'),
      formData
    );
  }
}
