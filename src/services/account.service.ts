import { BaseService } from './BaseService.js';
import type {
  AccountFees,
  CommercialInfo,
  UpdateCommercialInfoRequest,
  WalletListResponse,
} from '../types/account.js';

const WALLETS_PATH = '/api/v3/wallets';

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

  /** Recuperar carteiras (WalletId e lista de carteiras) */
  getWallets(): Promise<WalletListResponse> {
    return this.http.get<WalletListResponse>(WALLETS_PATH);
  }
}
