import { SubscriptionService } from '../../../src/services/subscription.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new SubscriptionService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('create sends POST to /api/v3/subscriptions', async () => {
    const payload = {
      customer: 'cus_1',
      billingType: 'BOLETO' as const,
      nextDueDate: '2025-12-31',
      value: 29.9,
      cycle: 'MONTHLY' as const,
    };
    const response = { id: 'sub_1', ...payload, status: 'ACTIVE' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.create(payload);
    expect(result.id).toBe('sub_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/subscriptions'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('getById sends GET to /api/v3/subscriptions/:id', async () => {
    const sub = { id: 'sub_1', value: 29.9, cycle: 'MONTHLY' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(sub), { status: 200 }));
    const result = await service.getById('sub_1');
    expect(result.id).toBe('sub_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/subscriptions/sub_1'),
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
    await service.list({ customer: 'cus_1', limit: 10 });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('customer=cus_1');
    expect(url).toContain('limit=10');
  });

  it('listPayments sends GET to /api/v3/subscriptions/:id/payments', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 0,
      limit: 10,
      offset: 0,
      data: [],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    await service.listPayments('sub_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/subscriptions/sub_1/payments'),
      expect.any(Object)
    );
  });

  it('update sends POST to /api/v3/subscriptions/:id', async () => {
    const updated = { id: 'sub_1', value: 39.9 };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(updated), { status: 200 }));
    const result = await service.update('sub_1', { value: 39.9 });
    expect(result.value).toBe(39.9);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/subscriptions/sub_1'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('delete sends DELETE to /api/v3/subscriptions/:id', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'sub_1', deleted: true }), { status: 200 })
    );
    await service.delete('sub_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/subscriptions/sub_1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
