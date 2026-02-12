import { CustomerService } from '../../../src/services/customer.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('CustomerService', () => {
  let service: CustomerService;
  let http: HttpClient;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new CustomerService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('create sends POST to /api/v3/customers', async () => {
    const payload = {
      name: 'Test',
      cpfCnpj: '24971563792',
      email: 'test@test.com',
    };
    const response = { id: 'cus_123', ...payload, notificationDisabled: false };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));

    const result = await service.create(payload);
    expect(result).toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/customers'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('getById sends GET to /api/v3/customers/:id', async () => {
    const customer = { id: 'cus_1', name: 'A', cpfCnpj: '123', notificationDisabled: false };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(customer), { status: 200 }));

    const result = await service.getById('cus_1');
    expect(result).toEqual(customer);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/customers/cus_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('list sends GET with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [{ id: 'cus_1', name: 'A', cpfCnpj: '123', notificationDisabled: false }],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));

    const result = await service.list({ limit: 10, offset: 0 });
    expect(result.data).toHaveLength(1);
    expect(result.totalCount).toBe(1);
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=0');
  });

  it('update sends POST to /api/v3/customers/:id', async () => {
    const updated = { id: 'cus_1', name: 'Updated', cpfCnpj: '123', notificationDisabled: false };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(updated), { status: 200 }));

    const result = await service.update('cus_1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/customers/cus_1'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('delete sends DELETE to /api/v3/customers/:id', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'cus_1', deleted: true }), { status: 200 })
    );
    await service.delete('cus_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/customers/cus_1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('restore sends POST to /api/v3/customers/:id/restore', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'cus_1', deleted: false }), { status: 200 })
    );
    await service.restore('cus_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/customers/cus_1/restore'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
