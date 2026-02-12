import {
  ASAAS_BASE_URL,
  DEFAULT_ENV,
  API_VERSION,
  HEADER_ACCESS_TOKEN,
} from '../../../src/constants/index';

describe('constants', () => {
  it('ASAAS_BASE_URL has sandbox and production', () => {
    expect(ASAAS_BASE_URL.sandbox).toBe('https://sandbox.asaas.com');
    expect(ASAAS_BASE_URL.production).toBe('https://www.asaas.com');
  });

  it('DEFAULT_ENV is sandbox', () => {
    expect(DEFAULT_ENV).toBe('sandbox');
  });

  it('API_VERSION is v3', () => {
    expect(API_VERSION).toBe('v3');
  });

  it('HEADER_ACCESS_TOKEN is access_token', () => {
    expect(HEADER_ACCESS_TOKEN).toBe('access_token');
  });
});
