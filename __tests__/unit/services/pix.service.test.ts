import { PixService } from '../../../src/services/pix.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('PixService', () => {
  let service: PixService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new PixService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('createAddressKey sends POST to /api/v3/pix/addressKeys', async () => {
    const payload = { type: 'EVP' as const };
    const response = { id: 'key_1', key: 'abc-123', type: 'EVP', status: 'ACTIVE' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.createAddressKey(payload);
    expect(result.id).toBe('key_1');
    expect(result.type).toBe('EVP');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/pix/addressKeys'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('listAddressKeys sends GET to /api/v3/pix/addressKeys with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [{ id: 'key_1', key: 'abc', type: 'EVP', status: 'ACTIVE' }],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.listAddressKeys({ limit: 10, offset: 0 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('key_1');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/pix/addressKeys');
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=0');
  });

  it('getAddressKeyById sends GET to /api/v3/pix/addressKeys/:id', async () => {
    const key = { id: 'key_1', key: 'abc-123', type: 'EVP', status: 'ACTIVE' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(key), { status: 200 }));
    const result = await service.getAddressKeyById('key_1');
    expect(result.id).toBe('key_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/pix/addressKeys/key_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('deleteAddressKey sends DELETE to /api/v3/pix/addressKeys/:id', async () => {
    const response = { id: 'key_1', status: 'DELETED' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.deleteAddressKey('key_1');
    expect(result.id).toBe('key_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/pix/addressKeys/key_1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('createStaticQrCode sends POST to /api/v3/pix/qrCodes/static', async () => {
    const payload = {
      addressKey: 'key-uuid-123',
      description: 'Pagamento',
      value: 50,
      format: 'ALL',
    };
    const response = { id: 'qr_1', payload: 'base64image...' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.createStaticQrCode(payload);
    expect(result.id).toBe('qr_1');
    expect(result.payload).toBe('base64image...');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/pix/qrCodes/static'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('listTransactions sends GET to /api/v3/pix/transactions with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [
        {
          id: 'tx_1',
          type: 'PIX_RECEIVED',
          value: 50,
          status: 'COMPLETED',
          dateCreated: '2024-01-15T10:00:00Z',
        },
      ],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.listTransactions({
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      limit: 10,
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('tx_1');
    expect(result.data[0].type).toBe('PIX_RECEIVED');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/pix/transactions');
    expect(url).toContain('dateFrom=2024-01-01');
    expect(url).toContain('dateTo=2024-01-31');
    expect(url).toContain('limit=10');
  });
});
