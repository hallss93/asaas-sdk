import { BillService } from '../../../src/services/bill.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('BillService', () => {
  let service: BillService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new BillService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('list sends GET to /api/v3/bill with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [
        {
          id: 'bill_1',
          status: 'PENDING',
          identificationField: '12345',
          value: 100,
          canBeCancelled: true,
        },
      ],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.list({ status: 'PENDING', limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('bill_1');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/bill');
    expect(url).toContain('status=PENDING');
    expect(url).toContain('limit=10');
  });

  it('getById sends GET to /api/v3/bill/:id', async () => {
    const bill = { id: 'bill_1', status: 'PENDING', value: 100, canBeCancelled: true };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(bill), { status: 200 }));
    const result = await service.getById('bill_1');
    expect(result.id).toBe('bill_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/bill/bill_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('simulate sends POST to /api/v3/bill/simulate', async () => {
    const linha = '12345.67890 12345.678901 12345.678901 1 12340000010000';
    const response = { value: 100, dueDate: '2025-12-31' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.simulate(linha);
    expect(result.value).toBe(100);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/bill/simulate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ identificationField: linha }),
      })
    );
  });

  it('create sends POST to /api/v3/bill', async () => {
    const payload = {
      identificationField: '12345.67890 12345.678901 12345.678901 1 12340000010000',
      scheduleDate: '2025-12-30',
    };
    const response = { id: 'bill_1', status: 'PENDING', ...payload };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.create(payload);
    expect(result.id).toBe('bill_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/bill'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('cancel sends POST to /api/v3/bill/:id/cancel', async () => {
    const response = { id: 'bill_1', status: 'CANCELLED' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.cancel('bill_1');
    expect(result.status).toBe('CANCELLED');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/bill/bill_1/cancel'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
