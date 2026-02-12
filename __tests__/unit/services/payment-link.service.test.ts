import { PaymentLinkService } from '../../../src/services/payment-link.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('PaymentLinkService', () => {
  let service: PaymentLinkService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new PaymentLinkService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('create sends POST to /api/v3/paymentLinks', async () => {
    const payload = {
      name: 'Link Test',
      value: 50,
      billingType: 'UNDEFINED',
      chargeType: 'DETACHED' as const,
    };
    const response = { id: 'link_1', ...payload, active: true };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.create(payload);
    expect(result.id).toBe('link_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentLinks'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('getById sends GET to /api/v3/paymentLinks/:id', async () => {
    const link = { id: 'link_1', name: 'Link', value: 50, active: true };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(link), { status: 200 }));
    const result = await service.getById('link_1');
    expect(result.id).toBe('link_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentLinks/link_1'),
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
    await service.list({ active: true, limit: 10 });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('active=true');
    expect(url).toContain('limit=10');
  });

  it('update sends PUT to /api/v3/paymentLinks/:id', async () => {
    const updated = { id: 'link_1', name: 'Updated', value: 20 };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(updated), { status: 200 }));
    const result = await service.update('link_1', { value: 20 });
    expect(result.value).toBe(20);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentLinks/link_1'),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('delete sends DELETE to /api/v3/paymentLinks/:id', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'link_1', deleted: true }), {
        status: 200,
      })
    );
    await service.delete('link_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentLinks/link_1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('restore sends POST to /api/v3/paymentLinks/:id/restore', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'link_1', deleted: false }), {
        status: 200,
      })
    );
    await service.restore('link_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/paymentLinks/link_1/restore'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  describe('images', () => {
    it('addImage sends POST multipart to /api/v3/paymentLinks/:id/images', async () => {
      const image = new Blob(['fake-image'], { type: 'image/png' });
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'img_1', main: true }), { status: 200 })
      );
      const result = await service.addImage('link_1', { main: true, image });
      expect(result.id).toBe('img_1');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v3/paymentLinks/link_1/images'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('listImages sends GET and returns data array', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [{ id: 'img_1' }] }), { status: 200 })
      );
      const result = await service.listImages('link_1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('img_1');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v3/paymentLinks/link_1/images'),
        expect.any(Object)
      );
    });

    it('getImage sends GET to /api/v3/paymentLinks/:id/images/:imageId', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'img_1', main: true }), { status: 200 })
      );
      const result = await service.getImage('link_1', 'img_1');
      expect(result.id).toBe('img_1');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v3/paymentLinks/link_1/images/img_1'),
        expect.any(Object)
      );
    });

    it('deleteImage sends DELETE to /api/v3/paymentLinks/:id/images/:imageId', async () => {
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
      await service.deleteImage('link_1', 'img_1');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v3/paymentLinks/link_1/images/img_1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('setImageAsMain sends POST to setAsMain', async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'img_1', main: true }), { status: 200 })
      );
      const result = await service.setImageAsMain('link_1', 'img_1');
      expect(result.main).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v3/paymentLinks/link_1/images/img_1/setAsMain'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
