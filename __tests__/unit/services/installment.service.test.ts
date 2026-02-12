import { InstallmentService } from '../../../src/services/installment.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('InstallmentService', () => {
  let service: InstallmentService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new InstallmentService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('getById sends GET to /api/v3/installments/:id', async () => {
    const installment = {
      id: 'inst_1',
      installmentCount: 3,
      value: 100,
      status: 'PENDING',
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(installment), { status: 200 }));
    const result = await service.getById('inst_1');
    expect(result.id).toBe('inst_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/installments/inst_1'),
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
    await service.list({ limit: 10, offset: 0 });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=0');
  });

  it('delete sends DELETE to /api/v3/installments/:id', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'inst_1', deleted: true }), {
        status: 200,
      })
    );
    await service.delete('inst_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/installments/inst_1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('refund sends POST to /api/v3/installments/:id/refund', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'inst_1', status: 'REFUNDED' }), {
        status: 200,
      })
    );
    await service.refund('inst_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/installments/inst_1/refund'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
