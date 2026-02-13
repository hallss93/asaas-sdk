import { InvoiceService } from '../../../src/services/invoice.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new InvoiceService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('list sends GET to /api/v3/invoices with query params', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [
        {
          id: 'inv_1',
          payment: 'pay_1',
          status: 'PENDING',
          serviceDescription: 'Serviço',
        },
      ],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.list({ payment: 'pay_1', limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('inv_1');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/invoices');
    expect(url).toContain('payment=pay_1');
    expect(url).toContain('limit=10');
  });

  it('getById sends GET to /api/v3/invoices/:id', async () => {
    const invoice = { id: 'inv_1', payment: 'pay_1', status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(invoice), { status: 200 }));
    const result = await service.getById('inv_1');
    expect(result.id).toBe('inv_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/invoices/inv_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('schedule sends POST to /api/v3/invoices', async () => {
    const payload = { payment: 'pay_1', serviceDescription: 'Consultoria' };
    const response = { id: 'inv_1', ...payload, status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.schedule(payload);
    expect(result.id).toBe('inv_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/invoices'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('update sends PUT to /api/v3/invoices/:id', async () => {
    const payload = { serviceDescription: 'Descrição atualizada', observations: 'Obs' };
    const response = { id: 'inv_1', ...payload };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.update('inv_1', payload);
    expect(result.serviceDescription).toBe('Descrição atualizada');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/invoices/inv_1'),
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(payload) })
    );
  });

  it('authorize sends POST to /api/v3/invoices/:id/authorize', async () => {
    const response = { id: 'inv_1', status: 'AUTHORIZED', pdfUrl: 'https://...' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.authorize('inv_1');
    expect(result.status).toBe('AUTHORIZED');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/invoices/inv_1/authorize'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
