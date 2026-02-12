import { AsaasClient } from '../../../src/client/AsaasClient';

const originalEnv = process.env;

describe('AsaasClient', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.ASAAS_API_KEY;
    delete process.env.ASAAS_ENV;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('constructor with config', () => {
    it('uses apiKey from config', () => {
      const client = new AsaasClient({ apiKey: 'key_from_config', environment: 'sandbox' });
      expect(client.customers).toBeDefined();
      expect(client.payments).toBeDefined();
      expect(client.installments).toBeDefined();
      expect(client.notifications).toBeDefined();
      expect(client.paymentLinks).toBeDefined();
      expect(client.subscriptions).toBeDefined();
      expect(client.transfers).toBeDefined();
    });

    it('uses environment production from config', () => {
      const client = new AsaasClient({
        apiKey: 'key',
        environment: 'production',
      });
      expect(client).toBeInstanceOf(AsaasClient);
    });

    it('uses custom baseUrl when provided', () => {
      const client = new AsaasClient({
        apiKey: 'key',
        baseUrl: 'https://custom.asaas.com',
      });
      expect(client).toBeInstanceOf(AsaasClient);
    });

    it('throws when no apiKey in config and no env', () => {
      expect(() => new AsaasClient()).toThrow('API Key is required');
      expect(() => new AsaasClient({})).toThrow('API Key is required');
    });

    it('uses env when config is not provided', () => {
      process.env.ASAAS_API_KEY = 'env_key';
      process.env.ASAAS_ENV = 'sandbox';
      const client = new AsaasClient();
      expect(client).toBeInstanceOf(AsaasClient);
    });

    it('config apiKey overrides env', () => {
      process.env.ASAAS_API_KEY = 'env_key';
      const client = new AsaasClient({ apiKey: 'config_key', environment: 'sandbox' });
      expect(client).toBeInstanceOf(AsaasClient);
    });

    it('custom baseUrl overrides environment', () => {
      const client = new AsaasClient({
        apiKey: 'key',
        environment: 'production',
        baseUrl: 'https://other.example.com',
      });
      expect(client).toBeInstanceOf(AsaasClient);
    });

    it('falls back to sandbox when ASAAS_ENV is invalid', () => {
      process.env.ASAAS_API_KEY = 'env_key';
      process.env.ASAAS_ENV = 'invalid';
      const client = new AsaasClient();
      expect(client).toBeInstanceOf(AsaasClient);
    });
  });

  describe('integration with services', () => {
    it('customers.create can be called (mocked fetch)', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 'cus_123',
            name: 'Test',
            cpfCnpj: '123',
            notificationDisabled: false,
          }),
          { status: 200 }
        )
      );
      const client = new AsaasClient({ apiKey: 'key', environment: 'sandbox' });
      const result = await client.customers.create({
        name: 'Test',
        cpfCnpj: '123',
      });
      expect(result.id).toBe('cus_123');
      expect(fetchSpy).toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });
});
