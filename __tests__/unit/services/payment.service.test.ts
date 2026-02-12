import { PaymentService } from '../../../src/services/payment.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('PaymentService', () => {
  let service: PaymentService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new PaymentService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('create sends POST to /api/v3/payments', async () => {
    const payload = {
      customer: 'cus_1',
      billingType: 'BOLETO' as const,
      dueDate: '2025-12-31',
      value: 100,
    };
    const response = { id: 'pay_1', ...payload, status: 'PENDING' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));

    const result = await service.create(payload);
    expect(result.id).toBe('pay_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('getById sends GET to /api/v3/payments/:id', async () => {
    const payment = {
      id: 'pay_1',
      customer: 'cus_1',
      billingType: 'BOLETO',
      dueDate: '2025-12-31',
      value: 100,
      status: 'PENDING',
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(payment), { status: 200 }));

    const result = await service.getById('pay_1');
    expect(result).toEqual(payment);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('update sends POST to /api/v3/payments/:id', async () => {
    const updated = {
      id: 'pay_1',
      customer: 'cus_1',
      billingType: 'BOLETO',
      dueDate: '2025-12-31',
      value: 150,
      status: 'PENDING',
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(updated), { status: 200 }));
    const result = await service.update('pay_1', { value: 150 });
    expect(result.value).toBe(150);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ value: 150 }) })
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

  it('refund sends POST to /api/v3/payments/:id/refund', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'pay_1', status: 'REFUNDED' }), { status: 200 })
    );
    await service.refund('pay_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1/refund'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('getPixQrCode sends GET to /api/v3/payments/:id/pixQrCode', async () => {
    const pix = { encodedImage: 'base64...', payload: 'pix...' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(pix), { status: 200 }));
    const result = await service.getPixQrCode('pay_1');
    expect(result.payload).toBe('pix...');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1/pixQrCode'),
      expect.any(Object)
    );
  });

  it('getDigitableLine sends GET to identificationField', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ identificationField: '12345.67890' }), { status: 200 })
    );
    const result = await service.getDigitableLine('pay_1');
    expect(result.identificationField).toBe('12345.67890');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1/identificationField'),
      expect.any(Object)
    );
  });

  it('restore sends POST to restore', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'pay_1', deleted: false }), { status: 200 })
    );
    await service.restore('pay_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1/restore'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('receiveInCash sends POST with body', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'pay_1', status: 'RECEIVED_IN_CASH' }), { status: 200 })
    );
    await service.receiveInCash('pay_1', '2025-02-12', 100);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1/receiveInCash'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ paymentDate: '2025-02-12', value: 100, notifyCustomer: undefined }),
      })
    );
  });

  it('undoReceivedInCash sends POST', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'pay_1' }), { status: 200 }));
    await service.undoReceivedInCash('pay_1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/payments/pay_1/undoReceivedInCash'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
