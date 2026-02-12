import { AnticipationService } from '../../../src/services/anticipation.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('AnticipationService', () => {
  let service: AnticipationService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new AnticipationService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('simulate sends POST to /api/v3/anticipations/simulate', async () => {
    const payload = { payment: 'pay_123' };
    const response = { id: 'ant_1', value: 100, status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.simulate(payload);
    expect(result.id).toBe('ant_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/anticipations/simulate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('create without documents sends POST to /api/v3/anticipations', async () => {
    const payload = {
      agreementSignature: 'Nome Assinante',
      payment: 'pay_123',
    };
    const response = { id: 'ant_1', value: 100, status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.create(payload);
    expect(result.id).toBe('ant_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/anticipations'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('create with documents sends POST multipart', async () => {
    const payload = {
      agreementSignature: 'Nome',
      payment: 'pay_123',
    };
    const blob = new Blob(['doc']);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'ant_1', status: 'PENDING' }), {
        status: 200,
      })
    );
    await service.create(payload, [{ file: blob, filename: 'doc.pdf' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/anticipations'),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
  });

  it('getById sends GET to /api/v3/anticipations/:id', async () => {
    const anticipation = { id: 'ant_1', value: 100, status: 'COMPLETED' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(anticipation), { status: 200 }));
    const result = await service.getById('ant_1');
    expect(result.id).toBe('ant_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/anticipations/ant_1'),
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
    await service.list({ payment: 'pay_123', limit: 10 });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('payment=pay_123');
    expect(url).toContain('limit=10');
  });
});
