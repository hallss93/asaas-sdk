import { StatementService } from '../../../src/services/statement.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('StatementService', () => {
  let service: StatementService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new StatementService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('list sends GET to /api/v3/financialTransactions', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 1,
      limit: 10,
      offset: 0,
      data: [
        {
          id: 'ft_1',
          type: 'CREDIT',
          value: 100.5,
          balance: 1500,
          dateCreated: '2024-01-15',
          description: 'Pagamento recebido',
        },
      ],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    const result = await service.list();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('ft_1');
    expect(result.data[0].value).toBe(100.5);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/financialTransactions'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('list with params sends GET with dateFrom, dateTo, offset, limit', async () => {
    const listResponse = {
      object: 'list',
      hasMore: false,
      totalCount: 0,
      limit: 20,
      offset: 0,
      data: [],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(listResponse), { status: 200 }));
    await service.list({
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      offset: 0,
      limit: 20,
    });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/api/v3/financialTransactions');
    expect(url).toContain('dateFrom=2024-01-01');
    expect(url).toContain('dateTo=2024-01-31');
    expect(url).toContain('offset=0');
    expect(url).toContain('limit=20');
  });
});
