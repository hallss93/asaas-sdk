import { WebhookService } from '../../../src/services/webhook.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('WebhookService', () => {
  let service: WebhookService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new WebhookService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('getPayment sends GET to /api/v3/webhook', async () => {
    const settings = { url: 'https://example.com/webhook', enabled: true };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(settings), { status: 200 }));
    const result = await service.getPayment();
    expect(result.url).toBe('https://example.com/webhook');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/webhook'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('updatePayment sends POST to /api/v3/webhook', async () => {
    const data = {
      url: 'https://example.com/webhook',
      email: 'admin@example.com',
      enabled: true,
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(data), { status: 200 }));
    const result = await service.updatePayment(data);
    expect(result.enabled).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/webhook'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  });

  it('getInvoice sends GET to /api/v3/webhook/invoice', async () => {
    const settings = { url: 'https://example.com/invoice-webhook' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(settings), { status: 200 }));
    const result = await service.getInvoice();
    expect(result.url).toBe('https://example.com/invoice-webhook');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/webhook/invoice'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('updateInvoice sends POST to /api/v3/webhook/invoice', async () => {
    const data = { url: 'https://example.com/invoice', enabled: true };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(data), { status: 200 }));
    const result = await service.updateInvoice(data);
    expect(result.url).toBe('https://example.com/invoice');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/webhook/invoice'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  });
});
