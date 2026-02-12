import { TransferService } from '../../../src/services/transfer.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('TransferService', () => {
  let service: TransferService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new TransferService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('createToBank sends POST to /api/v3/transfers', async () => {
    const payload = {
      value: 1000,
      bankAccount: {
        bank: { code: '237' },
        accountName: 'Conta Teste',
        ownerName: 'Fulano',
        ownerBirthDate: '1990-01-01',
        cpfCnpj: '52233424611',
        agency: '1263',
        account: '9999991',
        accountDigit: '1',
        bankAccountType: 'CONTA_CORRENTE' as const,
      },
    };
    const response = { id: 'transf_1', value: 1000, status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.createToBank(payload);
    expect(result.id).toBe('transf_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/transfers'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('createToAsaas sends POST to /api/v3/transfers', async () => {
    const payload = { value: 500, walletId: 'wallet_123' };
    const response = { id: 'transf_2', value: 500, status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.createToAsaas(payload);
    expect(result.id).toBe('transf_2');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/transfers'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('getById sends GET to /api/v3/transfers/:id', async () => {
    const transfer = { id: 'transf_1', value: 1000, status: 'COMPLETED' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(transfer), { status: 200 }));
    const result = await service.getById('transf_1');
    expect(result.id).toBe('transf_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/transfers/transf_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('list sends GET with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 0,
      limit: 10,
      offset: 0,
      data: [],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    await service.list({ type: 'BANK', limit: 10 });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('type=BANK');
    expect(url).toContain('limit=10');
  });
});
