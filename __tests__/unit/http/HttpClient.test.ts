import { HttpClient } from '../../../src/http/HttpClient';
import { AsaasApiError } from '../../../src/errors/AsaasApiError';

const BASE = 'https://sandbox.asaas.com';
const API_KEY = 'test_api_key';

describe('HttpClient', () => {
  let client: HttpClient;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    client = new HttpClient({ baseUrl: BASE, apiKey: API_KEY });
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  describe('constructor', () => {
    it('throws if apiKey is empty', () => {
      expect(() => new HttpClient({ baseUrl: BASE, apiKey: '' })).toThrow(
        'Asaas API Key is required'
      );
      expect(() => new HttpClient({ baseUrl: BASE, apiKey: '   ' })).toThrow(
        'Asaas API Key is required'
      );
    });

    it('throws if baseUrl is empty', () => {
      expect(() => new HttpClient({ baseUrl: '', apiKey: API_KEY })).toThrow(
        'Asaas base URL is required'
      );
    });

    it('creates instance with valid config', () => {
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe('get', () => {
    it('calls fetch with correct URL and headers', async () => {
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ id: '1' }), { status: 200 }));
      await client.get<{ id: string }>('/api/v3/customers/1');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://sandbox.asaas.com/api/v3/customers/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            access_token: API_KEY,
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('appends query params when provided', async () => {
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
      await client.get('/api/v3/customers', { limit: 10, offset: 0 });
      const url = fetchMock.mock.calls[0][0];
      expect(url).toContain('limit=10');
      expect(url).toContain('offset=0');
    });

    it('returns parsed JSON on success', async () => {
      const data = { id: 'cus_123', name: 'Test' };
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(data), { status: 200 }));
      const result = await client.get<typeof data>('/api/v3/customers/123');
      expect(result).toEqual(data);
    });

    it('throws AsaasApiError on 4xx', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ errors: [{ code: 'invalid', description: 'Invalid request' }] }),
          { status: 400 }
        )
      );
      try {
        await client.get('/api/v3/customers/x');
      } catch (err) {
        expect(err).toBeInstanceOf(AsaasApiError);
        expect(err).toMatchObject({
          status: 400,
          message: 'Invalid request',
        });
        return;
      }
      throw new Error('Expected AsaasApiError');
    });

    it('throws AsaasApiError on 5xx', async () => {
      fetchMock.mockResolvedValueOnce(new Response('Server Error', { status: 500 }));
      await expect(client.get('/api/v3/customers')).rejects.toThrow(AsaasApiError);
    });

    it('uses description when errors array is missing', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ description: 'Bad request' }), { status: 400 })
      );
      try {
        await client.get('/api/v3/customers/x');
      } catch (err) {
        expect(err).toBeInstanceOf(AsaasApiError);
        expect((err as AsaasApiError).message).toBe('Bad request');
        return;
      }
      throw new Error('Expected AsaasApiError');
    });

    it('uses HTTP status as message when body has no description', async () => {
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 404 }));
      try {
        await client.get('/api/v3/customers/x');
      } catch (err) {
        expect(err).toBeInstanceOf(AsaasApiError);
        expect((err as AsaasApiError).message).toBe('HTTP 404');
        return;
      }
      throw new Error('Expected AsaasApiError');
    });
  });

  describe('post', () => {
    it('sends body as JSON', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'pay_1' }), { status: 200 })
      );
      const body = { customer: 'cus_1', value: 100 };
      await client.post('/api/v3/payments', body);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe('put', () => {
    it('sends body as JSON', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'cus_1', name: 'Updated' }), { status: 200 })
      );
      await client.put('/api/v3/customers/cus_1', { name: 'Updated' });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v3/customers/cus_1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' }),
        })
      );
    });
  });

  describe('delete', () => {
    it('calls DELETE method', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ deleted: true }), { status: 200 })
      );
      await client.delete('/api/v3/customers/1');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/customers/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
