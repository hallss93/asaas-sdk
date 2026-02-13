import { CreditBureauService } from '../../../src/services/credit-bureau.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('CreditBureauService', () => {
  let service: CreditBureauService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new CreditBureauService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('consult with customer id sends POST to /api/v3/creditBureauReport', async () => {
    const request = { customer: 'cus_123' };
    const response = { id: 'report_1', status: 'COMPLETED', customer: 'cus_123' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.consult(request);
    expect(result.id).toBe('report_1');
    expect(result.customer).toBe('cus_123');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/creditBureauReport'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    );
  });

  it('consult with customerData sends POST with cpfCnpj', async () => {
    const request = {
      customerData: {
        cpfCnpj: '24971563792',
        name: 'João Silva',
        email: 'joao@email.com',
      },
    };
    const response = { id: 'report_2', status: 'COMPLETED', dateCreated: '2024-01-15' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.consult(request);
    expect(result.id).toBe('report_2');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/creditBureauReport'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    );
  });
});
