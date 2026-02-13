import { SubAccountService } from '../../../src/services/sub-account.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('SubAccountService', () => {
  let service: SubAccountService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new SubAccountService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('list sends GET to /api/v3/accounts with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [
        {
          id: 'acc_1',
          name: 'Subconta Teste',
          email: 'sub@example.com',
          cpfCnpj: '66625514000140',
        },
      ],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.list({ limit: 10, offset: 0 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('acc_1');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/accounts');
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=0');
  });

  it('getById sends GET to /api/v3/accounts/:id', async () => {
    const subAccount = {
      id: 'acc_1',
      name: 'Subconta Teste',
      email: 'sub@example.com',
      cpfCnpj: '66625514000140',
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(subAccount), { status: 200 }));
    const result = await service.getById('acc_1');
    expect(result.id).toBe('acc_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/accounts/acc_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('create sends POST to /api/v3/accounts', async () => {
    const payload = {
      name: 'Subconta Nova',
      email: 'nova@example.com',
      cpfCnpj: '66625514000140',
      birthDate: '1994-05-16',
      companyType: 'MEI',
    };
    const response = {
      id: 'acc_1',
      apiKey: 'key_sub_xxx',
      walletId: 'wallet_1',
      ...payload,
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.create(payload);
    expect(result.id).toBe('acc_1');
    expect(result.apiKey).toBe('key_sub_xxx');
    expect(result.walletId).toBe('wallet_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/accounts'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });
});
