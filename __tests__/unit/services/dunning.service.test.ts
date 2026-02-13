import { DunningService } from '../../../src/services/dunning.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('DunningService', () => {
  let service: DunningService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new DunningService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('list sends GET to /api/v3/paymentDunnings with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [{ id: 'dun_1', payment: 'pay_1', status: 'PENDING', canBeCancelled: true }],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.list({ limit: 10, offset: 0 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('dun_1');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/paymentDunnings');
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=0');
  });

  it('getById sends GET to /api/v3/paymentDunnings/:id', async () => {
    const dunning = { id: 'dun_1', payment: 'pay_1', status: 'PENDING', canBeCancelled: true };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(dunning), { status: 200 }));
    const result = await service.getById('dun_1');
    expect(result.id).toBe('dun_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentDunnings/dun_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('cancel sends POST to /api/v3/paymentDunnings/:id/cancel', async () => {
    const response = { id: 'dun_1', status: 'AWAITING_CANCELLATION' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.cancel('dun_1');
    expect(result.status).toBe('AWAITING_CANCELLATION');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentDunnings/dun_1/cancel'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('resendDocuments sends POST multipart to /api/v3/paymentDunnings/:id/documents', async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['doc']), 'doc.pdf');
    const response = { id: 'dun_1', status: 'AWAITING_APPROVAL' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.resendDocuments('dun_1', formData);
    expect(result.status).toBe('AWAITING_APPROVAL');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentDunnings/dun_1/documents'),
      expect.objectContaining({ method: 'POST', body: formData })
    );
  });

  it('listHistory sends GET to /api/v3/paymentDunnings/:id/history', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [{ id: 'evt_1', type: 'CREATED', description: 'Negativação criada' }],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.listHistory('dun_1', { limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].type).toBe('CREATED');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/paymentDunnings/dun_1/history');
    expect(url).toContain('limit=10');
  });

  it('listPartialPayments sends GET to /api/v3/paymentDunnings/:id/partialPayments', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 0,
      limit: 10,
      offset: 0,
      data: [],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.listPartialPayments('dun_1');
    expect(result.data).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentDunnings/dun_1/partialPayments'),
      expect.any(Object)
    );
  });
});
