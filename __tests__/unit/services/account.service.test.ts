import { AccountService } from '../../../src/services/account.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('AccountService', () => {
  let service: AccountService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new AccountService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('getCommercialInfo sends GET to /api/v3/myAccount/commercialInfo', async () => {
    const response = {
      companyName: 'Empresa LTDA',
      cpfCnpj: '12345678000199',
      commercialInfoExpiration: { isExpired: false },
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.getCommercialInfo();
    expect(result.companyName).toBe('Empresa LTDA');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/myAccount/commercialInfo'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('updateCommercialInfo sends POST to /api/v3/myAccount/commercialInfo', async () => {
    const payload = { companyName: 'Nova Razão Social', phone: '11999999999' };
    const response = { id: 'acc_1', ...payload };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.updateCommercialInfo(payload);
    expect(result.companyName).toBe('Nova Razão Social');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/myAccount/commercialInfo'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('getFees sends GET to /api/v3/myAccount/fees', async () => {
    const response = { creditCardFee: 2.99, bankSlipFee: 1.99 };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.getFees();
    expect(result.creditCardFee).toBe(2.99);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/myAccount/fees'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getWallets sends GET to /api/v3/wallets', async () => {
    const response = { totalCount: 1, data: [{ id: 'wallet_1', name: 'Carteira Principal' }] };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.getWallets();
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0]?.id).toBe('wallet_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/wallets'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
