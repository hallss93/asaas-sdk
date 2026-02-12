import { NotificationService } from '../../../src/services/notification.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('NotificationService', () => {
  let service: NotificationService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new NotificationService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('update sends POST to /api/v3/notifications/:id', async () => {
    const data = {
      enabled: true,
      emailEnabledForCustomer: true,
      scheduleOffset: 5,
    };
    const response = { id: 'notif_1', ...data };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.update('notif_1', data);
    expect(result.enabled).toBe(true);
    expect(result.scheduleOffset).toBe(5);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/notifications/notif_1'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  });
});
